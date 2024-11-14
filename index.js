const fs = require('fs');

// Constants
const NUM_PLAYERS = 26;
const NUM_MATCHES_PER_ROUND = NUM_PLAYERS / 2;

// Generate player labels
const players = Array.from({ length: NUM_PLAYERS }, (_, i) => `P${i + 1}`);

// Initialize counters for umpiring and playing
const umpireCount = players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {});
const matchCount = players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {});

// Function to generate the full schedule
function generateSchedule() {
    const schedule = [];

    for (let round = 0; round < NUM_PLAYERS - 1; round++) {
        const roundMatches = [];
        const umpires = [...players];  // All players eligible as umpires

        // Rotate the players (except for the fixed P1)
        const playerRotation = [players[0], ...players.slice(1 + round), ...players.slice(1, round + 1)];

        // Pair up the players for the round
        for (let match = 0; match < NUM_MATCHES_PER_ROUND; match++) {
            const player1 = playerRotation[match];
            const player2 = playerRotation[playerRotation.length - 1 - match];
            
            // Increment match counts for both players
            matchCount[player1]++;
            matchCount[player2]++;
            
            // Find an umpire that is not playing in this match, preferring players with fewer umpire assignments
            const eligibleUmpires = umpires.filter(u => u !== player1 && u !== player2);
            eligibleUmpires.sort((a, b) => umpireCount[a] - umpireCount[b]);  // Sort by umpire counts
            const umpire = eligibleUmpires[0];
            
            // Update umpire count and remove the chosen umpire from the round's pool
            umpireCount[umpire]++;
            umpires.splice(umpires.indexOf(umpire), 1);

            roundMatches.push(`Match ${match + 1}: ${player1} vs ${player2} (U: ${umpire})`);
        }

        schedule.push(`Round ${round + 1}\n` + roundMatches.join('\n'));
    }

    return schedule;
}

// Generate the schedule
const schedule = generateSchedule();

// Write the schedule to a file
fs.writeFileSync('table_tennis_schedule.txt', schedule.join('\n\n'), 'utf-8');

// Append the final counts (Umpire Count and Match Count) to the file
fs.appendFileSync('table_tennis_schedule.txt', '\n\nFinal Umpire Count:\n' + JSON.stringify(umpireCount, null, 2));
fs.appendFileSync('table_tennis_schedule.txt', '\n\nFinal Match Count:\n' + JSON.stringify(matchCount, null, 2));

console.log('Schedule written to table_tennis_schedule.txt');
console.log('Final Umpire Count and Match Count appended to the file.');
