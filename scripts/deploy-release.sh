#!/usr/bin/env bash
set -euo pipefail

: "${APP_NAME:?APP_NAME is required}"
: "${APP_PORT:?APP_PORT is required}"
: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${RELEASE_NAME:?RELEASE_NAME is required}"

INCOMING_DIR="${DEPLOY_PATH}/incoming"
RELEASES_DIR="${DEPLOY_PATH}/releases"
SHARED_DIR="${DEPLOY_PATH}/shared"
CURRENT_LINK="${DEPLOY_PATH}/current"
PACKAGE_PATH="${INCOMING_DIR}/${RELEASE_NAME}.tar.gz"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_NAME}"

echo "==> Validating server runtime"
command -v node >/dev/null 2>&1 || {
  echo "node is not installed on the server." >&2
  exit 1
}
command -v npm >/dev/null 2>&1 || {
  echo "npm is not installed on the server." >&2
  exit 1
}

echo "==> Preparing directories"
mkdir -p "${INCOMING_DIR}" "${RELEASES_DIR}" "${SHARED_DIR}"
rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}"

if [[ ! -f "${PACKAGE_PATH}" ]]; then
  echo "Release package not found: ${PACKAGE_PATH}" >&2
  exit 1
fi

echo "==> Extracting release ${RELEASE_NAME}"
tar -xzf "${PACKAGE_PATH}" -C "${RELEASE_DIR}"

if [[ -f "${SHARED_DIR}/.env.production" ]]; then
  cp "${SHARED_DIR}/.env.production" "${RELEASE_DIR}/.env.production"
fi

if [[ ! -f "${RELEASE_DIR}/server.js" ]]; then
  echo "server.js is missing from the release bundle." >&2
  exit 1
fi

ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Installing PM2"
  npm install -g pm2 --no-audit --no-fund
fi

echo "==> Reloading PM2"
export APP_CWD="${CURRENT_LINK}"
export PORT="${APP_PORT}"
export NODE_ENV="production"

pm2 startOrReload "${CURRENT_LINK}/ecosystem.config.cjs" --update-env
pm2 save

echo "==> Cleaning uploaded files"
rm -f "${PACKAGE_PATH}"

echo "==> Pruning old releases"
current_target="$(readlink -f "${CURRENT_LINK}")"
readarray -t old_releases < <(find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -nr | awk 'NR > 5 {print $2}')

for release_path in "${old_releases[@]}"; do
  [[ -z "${release_path}" ]] && continue
  [[ "${release_path}" == "${current_target}" ]] && continue
  rm -rf "${release_path}"
done

echo "==> Deployment finished"
