const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const GphApiClient = require('giphy-js-sdk-core')
const giphyClient = GphApiClient(auth.GphApiClient) //make this private
const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: .5
};

/*
npm install discord.io,ytdl-core, giphy-js-sdk-core
*/
client.on('ready', () => {
    console.log('I am ready!');
    console.log("starting bot :" + new Date());

});

client.on('message', message => {
    if (message.toString().substring(0, 1) == '$') {
        console.log(message.author + ": " + new Date());
        var args = message.toString().substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'ping':
                message.channel.send("Hello " + message.author + " yes I am indeed alive");
                break;
            case 'srs':
                message.channel.send("(ಠ_ಠ)");
                break;
            case 'help': //TODO encode for formatting
                message.channel.send("Ask me to do something with $\nThis is what I know how to do:\n" +
                    "ping - see if I am functioning\n" +
                    "groups - see a list of groups who are playing and find their message codes\n" +
                    "message - followed by a message code to message everyone in a dnd game\n" +
                    "end - End a dnd session in style (need to be in voice channle to work)\n" +
                    "begone - kick me out of a voice channel(need to be in voice channle to work)\n" +
                    "coins - throw money at people in voice chat\n" +
                    "roll - Roll some dice example($roll 2d20)\n" +
                    "dance - time to boogie!\n" +
                    "oof - oof in voice chat\n" +
                    "play - play a single youTube video in voice chat at half volume\n" 
                );
                break;
            case 'groups': //TODO encode for formatting
                message.channel.send("Here are all of the groups currently playing Dungeons and Dragons:\n" +
                    "Out of the Abyss: oota\n" +
                    "Tyranny of Dragons: tod\n" +
                    "Dead in Thay: dit\n"
                );
                break;
            case 'message': //TODO encode for formatting
                var group = args[0]
                message.channel.send(findGroup(group.toString().trim()) + gatherMessage(args));
                break;
            case 'end':
                playAudio("roundabout.mp3", message);
                break;
            case 'begone':
                playAudio("begoneThot.mp3", message);
                break;
            case 'coins':
                playAudio("coins.wav", message);
                break;
            case 'awaken':
                playAudio("awaken.mp3", message);
            case 'oof':
                playAudio("roblox-death-sound_1.mp3", message);
                break;
            case 'roll': //TODO REformat results and add math modifiers
                var roll = args[0]
                var dice = roll.toString().substring(0).split('d');
                var results = "";
                if (dice[1] > 0 && dice[0] > 0) {
                    for (var i = 0; i < dice[0]; i++) {
                        results = results + "(**" + getRandomInt(dice[1]) + "**)";
                    }
                    message.channel.send({
                        embed: {
                            color: 039600,
                            description: results
                        }
                    });

                } else {
                    message.channel.send("Go ahead and double check those numbers");
                }
                break;
            case 'dance':
                giphyClient.random('gifs', {
                    "tag": "skeleton dance"
                }).then((response) => {
                    message.channel.send(response.data.url)
                }).catch((err) => {
                    console.log(err);
                })
                break;
            case 'memes':
                giphyClient.random('gifs', {
                    "tag": "memes"
                }).then((response) => {
                    message.channel.send(response.data.url)
                }).catch((err) => {
                    console.log(err);
                })
            break;
            case 'giph':
            var tag;
                for (var i = 0; i < args.length; i++) {
                    if(i==0){
                        tag = args[i];
                    }else{
                     tag = tag + " " + args[i];                       
                    }
                }
                giphyClient.random('gifs', {
                    "tag": tag
                }).then((response) => {
                    message.channel.send(response.data.url)
                }).catch((err) => {
                    console.log(err);
                })
            break;
            case 'stool': //TODO add color to encoding
                message.channel.send({
                    embed: {
                        image: {
                            url: "https://media.giphy.com/media/8FVaTy8b06Qpm7dtWY/giphy.gif"
                        }
                    }
                });
                break;
            case 'play':
                if (message.member.voiceChannel != null) {
                    var url = args[0]
                    var voiceChannel = message.member.voiceChannel;
                    voiceChannel.join().then(connection => {
                        const stream = ytdl(url, {
                            filter: 'audioonly'
                        });
                        const dispatcher = connection.playStream(stream, streamOptions);
                        dispatcher.on("end", end => {
                            voiceChannel.leave();
                        });

                    }).catch(err => console.log(err));
                } else {
                    message.channel.send("Could not Find user's current voice channel");
                }
                break;

        }
    }
    if (message.content.includes("406615325006626836")) {
        console.log(message.author + ": " + new Date());

        message.channel.send('Use $help to see what I can do')
    }
    if (message.toString() == ("<:jeffery:405525238034464778>")) {
        console.log(message.author + ": " + new Date());

        message.channel.send({
            embed: {
                image: {
                    url: "https://media.giphy.com/media/yr7n0u3qzO9nG/giphy.gif"
                }
            }
        });
    }
});
//TODO Pull these methods out into another file

function gatherMessage(args) {
    var message = "";
    for (var i = 1; i <= args.length - 1; i++) {
        message = (message + " " + args[i]);
    }
    return message;
}

function findGroup(group) { //TODO make this a DB
    var players;
    switch (group) {
        case 'oota':
            players = "(<@!196099263271403529>, <@!196315459186982912>, <@!244532654089830410>, <@!199541321289957376>, <@!201190399119851520>, <@!204585276897624064>, <@!187396555840552960>)";
            break;
        case 'tod':
            players = "(<@!196315459186982912>, <@!196099263271403529>, <@!199541321289957376>, <@!218554560363364352>, <@!310820323924639744>, <@!244532654089830410>)";
            break;
        case 'dit':
            players = "(<@!196099263271403529>, <@!196315459186982912>, <@!199541321289957376>, <@!218554560363364352>, <@!310820323924639744>, <@!392873864842969109>)";
            break;

    }
    return players;
}

function playAudio(fileName, message) {
    if (message.member.voiceChannel != null) {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            const dispatcher = connection.playFile('./music/' + fileName);
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });

        }).catch(err => console.log(err));
    } else {
        message.channel.send("Could not Find user's current voice channel");
    }
}

function getRandomInt(max) {
    min = Math.ceil(1);
    max = Math.floor(max);
    return Math.floor(Math.random() * ((max + 1) - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
client.login(auth.token);