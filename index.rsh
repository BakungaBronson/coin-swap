'reach 0.1';

const sharedFunctions = {
  // showFunds
  showFunds: Fun([UInt], Null),
}

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    // Specify Alice's interact interface here
    // addFunds
    ...sharedFunctions,
    addFunds: Fun([], UInt),
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
    // claimFunds
    ...sharedFunctions,
    claimFunds: Fun([UInt], Bool),
  });
  init();
  // The first one to publish deploys the contract
  A.only(() => {
    const funds = declassify(interact.addFunds());
  });
  A.publish(funds).pay(funds);
  commit();

  each([A, B], () => {
    interact.showFunds(funds);
  });

  // The second one to publish always attaches
  B.only(() => {
    const accepted = declassify(interact.claimFunds(funds));
  });
  B.publish(accepted);
  // write your program here

  transfer(funds).to(B);
  commit();
  exit();
});
