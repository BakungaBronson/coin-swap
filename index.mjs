import {loadStdlib, ask} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Hello, Alice and Bob!');
const [ balAlice, balBob ] = [ await stdlib.balanceOf(accAlice), await stdlib.balanceOf(accBob) ];
console.log(`Starting balance Alice: ${await stdlib.formatCurrency(balAlice)} and Bob: ${await stdlib.formatCurrency(balBob)}`);

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const sharedFunctions = {
  showFunds: async(funds) => {
    console.log(`Alice deposited ${await stdlib.formatCurrency(funds)} token`);
  }
}

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    // implement Alice's interact object here
    // addFunds
    // addFunds: Fun([], UInt),
    ...sharedFunctions,
    addFunds: async() => {
      const funds = await ask.ask('How many funds do you want to add?', parseInt);
      return stdlib.parseCurrency(funds);
    }
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
    // claimFunds
    // claimFunds: Fun([UInt], Bool),
    ...sharedFunctions,
    claimFunds: async(funds) => {
      const accepted = await ask.ask(`Do you want to accept the funds: ${await stdlib.formatCurrency(funds)}`, ask.yesno);
      return accepted;
    }
  }),
]);

const [ endBalAlice, endBalBob ] = [ await stdlib.balanceOf(accAlice), await stdlib.balanceOf(accBob) ];
console.log(`Ending balance Alice: ${await stdlib.formatCurrency(endBalAlice)} and Bob: ${await stdlib.formatCurrency(endBalBob)}`);

console.log('Goodbye, Alice and Bob!');
ask.done();