const { randomInt } = require('crypto')
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

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

token = getToken()

client.on('ready', () => {
    console.log('Code Names bot online');
})

client.on('message', msg => {
    if (msg.content === "!codenames start") {
        words = getWords()
        words_used = []
        first_team_words = []
        second_team_words = []
        
        // words for both first team
        while(first_team_words.length != 11) {
            random_word = words[randomInt(0,words.length)]

            if (!words_used.includes(random_word)) {
                first_team_words.push(random_word)
                words_used.push(random_word)
            }
        }

        // words for second team
        while(second_team_words.length != 10) {
            random_word = words[randomInt(0,words.length)]

            if (!words_used.includes(random_word)) {
                second_team_words.push(random_word)
                words_used.push(random_word)
            }
        }

        console.log(first_team_words)
        console.log(second_team_words)
    }
})

client.login(token)