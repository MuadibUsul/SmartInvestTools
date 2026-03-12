export type ProjectionPoint = {
  year: number;
  balance: number;
  contributions: number;
};

export type FeeAdjustedProjectionPoint = {
  year: number;
  balanceWithoutFees: number;
  balanceWithFees: number;
  feeDrag: number;
};

const MONTHS_IN_YEAR = 12;

export function annualRateToDecimal(ratePercent: number) {
  return ratePercent / 100;
}

export function monthlyRateFromAnnual(ratePercent: number) {
  return annualRateToDecimal(ratePercent) / MONTHS_IN_YEAR;
}

export function futureValueOfLumpSum(
  presentValue: number,
  annualRatePercent: number,
  years: number,
) {
  return presentValue * (1 + annualRateToDecimal(annualRatePercent)) ** years;
}

export function futureValueOfMonthlyContributions({
  initialAmount,
  monthlyContribution,
  annualRatePercent,
  years,
}: {
  initialAmount: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}) {
  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);
  const totalMonths = Math.max(Math.round(years * MONTHS_IN_YEAR), 0);
  let balance = initialAmount;

  for (let month = 0; month < totalMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }

  return balance;
}

export function buildLumpSumProjection({
  initialAmount,
  annualRatePercent,
  years,
}: {
  initialAmount: number;
  annualRatePercent: number;
  years: number;
}): ProjectionPoint[] {
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    projection.push({
      year,
      balance: futureValueOfLumpSum(initialAmount, annualRatePercent, year),
      contributions: initialAmount,
    });
  }

  return projection;
}

export function buildMonthlyContributionProjection({
  initialAmount,
  monthlyContribution,
  annualRatePercent,
  years,
}: {
  initialAmount: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}): ProjectionPoint[] {
  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);
  const totalMonths = Math.max(Math.round(years * MONTHS_IN_YEAR), 0);
  let balance = initialAmount;
  let contributions = initialAmount;
  const projection: ProjectionPoint[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    contributions += monthlyContribution;

    if (month % MONTHS_IN_YEAR === 0) {
      projection.push({
        year: month / MONTHS_IN_YEAR,
        balance,
        contributions,
      });
    }
  }

  return projection;
}

export function buildAnnualContributionProjection({
  initialAmount,
  annualContribution,
  annualRatePercent,
  years,
}: {
  initialAmount: number;
  annualContribution: number;
  annualRatePercent: number;
  years: number;
}) {
  const rate = annualRateToDecimal(annualRatePercent);
  let balance = initialAmount;
  let contributions = initialAmount;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    balance = balance * (1 + rate) + annualContribution;
    contributions += annualContribution;
    projection.push({
      year,
      balance,
      contributions,
    });
  }

  return projection;
}

export function buildFeeAdjustedProjection({
  initialAmount,
  annualReturnPercent,
  annualFeePercent,
  years,
}: {
  initialAmount: number;
  annualReturnPercent: number;
  annualFeePercent: number;
  years: number;
}) {
  const grossFactor = 1 + annualRateToDecimal(annualReturnPercent);
  const feeFactor = 1 - annualRateToDecimal(annualFeePercent);
  let balanceWithoutFees = initialAmount;
  let balanceWithFees = initialAmount;
  const projection: FeeAdjustedProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    balanceWithoutFees *= grossFactor;
    balanceWithFees *= grossFactor * feeFactor;

    projection.push({
      year,
      balanceWithoutFees,
      balanceWithFees,
      feeDrag: balanceWithoutFees - balanceWithFees,
    });
  }

  return projection;
}

export function solveMonthsToGoal({
  startingAmount,
  targetAmount,
  annualRatePercent,
  monthlyContribution,
  maxMonths = 1200,
}: {
  startingAmount: number;
  targetAmount: number;
  annualRatePercent: number;
  monthlyContribution: number;
  maxMonths?: number;
}) {
  if (targetAmount <= startingAmount) {
    return 0;
  }

  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);
  let balance = startingAmount;

  for (let month = 1; month <= maxMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;

    if (balance >= targetAmount) {
      return month;
    }
  }

  return null;
}

export function calculateRequiredMonthlyContribution({
  targetAmount,
  startingAmount,
  annualRatePercent,
  years,
}: {
  targetAmount: number;
  startingAmount: number;
  annualRatePercent: number;
  years: number;
}) {
  const totalMonths = Math.max(Math.round(years * MONTHS_IN_YEAR), 1);
  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);
  const targetGap =
    targetAmount -
    startingAmount * (1 + monthlyRate) ** totalMonths;

  if (targetGap <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return targetGap / totalMonths;
  }

  return targetGap * (monthlyRate / ((1 + monthlyRate) ** totalMonths - 1));
}

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  years: number,
) {
  const totalPayments = Math.max(Math.round(years * MONTHS_IN_YEAR), 1);
  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);

  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  return (
    (principal * monthlyRate) /
    (1 - (1 + monthlyRate) ** -totalPayments)
  );
}

export function buildLoanProjection(
  principal: number,
  annualRatePercent: number,
  years: number,
) {
  const monthlyPayment = calculateMonthlyPayment(
    principal,
    annualRatePercent,
    years,
  );
  const monthlyRate = monthlyRateFromAnnual(annualRatePercent);
  const totalPayments = Math.max(Math.round(years * MONTHS_IN_YEAR), 1);
  let balance = principal;
  let totalInterest = 0;
  const yearlyBalances: ProjectionPoint[] = [];

  for (let month = 1; month <= totalPayments; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(balance - principalPaid, 0);
    totalInterest += interest;

    if (month % MONTHS_IN_YEAR === 0 || month === totalPayments) {
      yearlyBalances.push({
        year: Math.ceil(month / MONTHS_IN_YEAR),
        balance,
        contributions: monthlyPayment * month,
      });
    }
  }

  return {
    monthlyPayment,
    totalRepayment: monthlyPayment * totalPayments,
    totalInterest,
    yearlyBalances,
  };
}

export function calculateSimpleInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
) {
  const interestEarned = principal * annualRateToDecimal(annualRatePercent) * years;

  return {
    interestEarned,
    finalAmount: principal + interestEarned,
  };
}

export function calculatePresentValue(
  futureValue: number,
  annualDiscountRatePercent: number,
  years: number,
) {
  return futureValue / (1 + annualRateToDecimal(annualDiscountRatePercent)) ** years;
}

export function calculateImpliedAnnualRate(
  presentValue: number,
  futureValue: number,
  years: number,
) {
  if (presentValue <= 0 || futureValue <= 0 || years <= 0) {
    return 0;
  }

  return ((futureValue / presentValue) ** (1 / years) - 1) * 100;
}

export function calculateCagr(
  beginningValue: number,
  endingValue: number,
  years: number,
) {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) {
    return 0;
  }

  return ((endingValue / beginningValue) ** (1 / years) - 1) * 100;
}

export function formatMonthsAsYears(months: number, digits = 1) {
  return months / MONTHS_IN_YEAR;
}

export function calculateCurrentYield(
  faceValue: number,
  couponRatePercent: number,
  price: number,
) {
  if (price <= 0) {
    return 0;
  }

  return (faceValue * annualRateToDecimal(couponRatePercent) * 100) / price;
}
