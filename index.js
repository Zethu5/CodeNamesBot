const { randomInt } = require('crypto')
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const shufflearray = require('shuffle-array')

config_file = "config.json"
words_file = "words.txt"

function getToken() {
    const data = fs.readFileSync(config_file, 'utf8')
    return JSON.parse(data).token
}

function getWords() {
    const data = fs.readFileSync(words_file, 'utf8')
    return data.split("\n")
}

function getLongestWordInColumnLength(arr) {
    longest = arr[0].length

    for(j = 1; j < arr.length; j++) {
        if (longest < arr[j].length) {
            longest = arr[j].length
        }
    }

    return longest
}

token = getToken()

client.on('ready', () => {
    console.log('Code Names bot online');
})

client.on('message', msg => {
    if (msg.content === "!codenames start") {
        words = getWords()
        words_used = []
        board = []

        // words for first team
        counter = 0
        while (counter != 11) {
            random_word = words[randomInt(0, words.length)]

            if (!words_used.includes(random_word)) {
                words_used.push(random_word.replace(/(\r|\n)/, ""))
                board.push("🟦" + random_word.replace(/(\r|\n)/, ""))
                counter++
            }
        }

        // words for second team
        counter = 0
        while (counter != 10) {
            random_word = words[randomInt(0, words.length)]

            if (!words_used.includes(random_word)) {
                words_used.push(random_word.replace(/(\r|\n)/, ""))
                board.push("🟥" + random_word.replace(/(\r|\n)/, ""))
                counter++
            }
        }

        // choose black word
        black_word = ""
        while (words_used.includes(random_word) || black_word == "") {
            random_word = words[randomInt(0, words.length)]

            if (!words_used.includes(random_word)) {
                black_word = random_word
                words_used.push(random_word.replace(/(\r|\n)/, ""))
                board.push("⬛" + random_word.replace(/(\r|\n)/, ""))
            }
        }

        // choose words
        while (words_used.length != 30) {
            random_word = words[randomInt(0, words.length)]

            if (!words_used.includes(random_word)) {
                words_used.push(random_word.replace(/(\r|\n)/, ""))
                board.push("⬜" + random_word.replace(/(\r|\n)/, ""))
            }
        }

        board = shufflearray(board)

        for(i = 0; i < 5; i++) {
            longest_word_in_column_length = getLongestWordInColumnLength([board[i], board[i+5], board[i+ 5*2], board[i+5*3], board[i+5*4], board[i+5*5]])
            board[i]         = board[i]         + " ".repeat(longest_word_in_column_length - board[i].length)
            board[i + 5]     = board[i + 5]     + " ".repeat(longest_word_in_column_length - board[i + 5].length)
            board[i + 5 * 2] = board[i + 5 * 2] + " ".repeat(longest_word_in_column_length - board[i + 5 * 2].length)
            board[i + 5 * 3] = board[i + 5 * 3] + " ".repeat(longest_word_in_column_length - board[i + 5 * 3].length)
            board[i + 5 * 4] = board[i + 5 * 4] + " ".repeat(longest_word_in_column_length - board[i + 5 * 4].length)
            board[i + 5 * 5] = board[i + 5 * 5] + " ".repeat(longest_word_in_column_length - board[i + 5 * 5].length)
        }

        team_string = ""
        captains_string = ""

        for (i = 0; i < board.length; i++) {
            if (i % 5 == 0) {
                captains_string += "\n"
                team_string += "\n"
            }

            captains_string += board[i] + " "
            team_string += board[i].replace(/(🟦|🟥|⬛|⬜)/," ") + "   "
        }

        
        const team_embed = new Discord.MessageEmbed()
            .setColor("#FFFFFF")
            .addFields({ name: "\u200b", value: "```" + team_string + "```" })
            .addFields({ name: "Number of words", value: words_used.length , inline: false})

        client.channels.cache.get(msg.channel.id).send(team_embed);

        const captain_embed = new Discord.MessageEmbed()
            .setColor("#FFFFFF")
            .addFields({ name: "\u200b", value: "```" + captains_string + "```" })
            .addFields({ name: "Number of words", value: words_used.length , inline: false})

        client.channels.cache.get("831642720778977280").send(captain_embed);
    }
})

client.login(token)