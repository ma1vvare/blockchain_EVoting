import subprocess

# Initialization phase --> Generates creator's pk and sk.
subprocess.call(" node creator.js", shell=True)
# Registration phase --> create psudo id(pid) with social security number.
subprocess.call(" node register.js A128373696", shell=True)
subprocess.call(" node register.js A128352115", shell=True)
subprocess.call(" node register.js A128345678", shell=True)
subprocess.call(" node register.js A125867983", shell=True)
# Voting phase --> enter pid and candidate's number, then system will split
# it into five cooridates automatically.
# then, write both pid and encrypted coordinates back to smart contract.
subprocess.call(
    "node voting_phase.js 6dd31aeaa04bfe8108d4fe442151bdca7c3434c63fc9a0a11afcd4e2b3af3d0e 10", shell=True)
subprocess.call(
    "node voting_phase.js 49bb9b8ab6f38858fcbfc4a08bd9fbedbe666ec51e5b30ef5f6c7e45188c2d69 9", shell=True)
subprocess.call(
    "node voting_phase.js 59c67160c45be5ba04e9220460df77568fffb59af9b41a99f8c5c19d6f86ba11 8", shell=True)
subprocess.call(
    "node voting_phase.js 8daaca27d124c60a81c83bf1ef3073ad97f6bcbb0c42035f41130d8db4fb78be 5", shell=True)
# Billing phase --> computes the voting system.
