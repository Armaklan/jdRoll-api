function Message(message) {
    var that = this;

    that.isPrivate = function() {
        return that.to;
    };

    if(message && message.from) {
        fromEvent(message);
    } else {
        fromDb(message);
    }

    function fromEvent(message) {
        that.id = message.id;
        that.to = message.to;
        that.from = message.from;
        that.text = message.text;
        that.time = new Date();
        that.private = that.isPrivate();
        parseChatMsg(that);
    }

    function fromDb(data) {
        that.id = data.id;
        that.to = data.to_username;
        that.from = data.username;
        that.text = data.message;
        that.time = data.time;
        that.private = that.isPrivate();
    }
}

module.exports = Message;


function parseChatMsg(message) {
    //On strip les tags HTML
    var cleanText = message.text.replace(/<\/?[^>]+(>|$)/g, "");

		//On remplace la forme HTML du '<' par son équivalent ascii
    cleanText = cleanText.replace(/&lt/g, "<");

    cleanText = urlLink(cleanText);
    cleanText = parseSmiley(cleanText);

    if(cleanText.search('/me') > -1) {
        cleanText = cleanText.replace("/me", message.from + " ");
				cleanText = `<span class="dialogue"><span style="font-size: 8.5pt; font-family: 'Verdana','sans-serif'; color: #4488cc;">${cleanText}</span></span>`;
        message.from = "";
    }

    message.text = cleanText;
}

function urlLink(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url.substring(0, 50) + '...</a>';
    });
}

function parseSmiley(cleanText) {
    const tinymce_emoticon = "../../../../vendor/tinymce/plugins/emoticons/img/";
    cleanText = cleanText.replace(":)", "<img src='" + tinymce_emoticon + "smiley-smile.gif' alt=''>");
    cleanText = cleanText.replace(";)", "<img src='" + tinymce_emoticon + "smiley-wink.gif' alt=''>");
    cleanText = cleanText.replace(":p", "<img src='" + tinymce_emoticon + "smiley-tongue-out.gif' alt=''>");
    cleanText = cleanText.replace(":X", "<img src='" + tinymce_emoticon + "smiley-sealed.gif' alt=''>");
    cleanText = cleanText.replace(":'(", "<img src='" + tinymce_emoticon + "smiley-cry.gif' alt=''>");
    cleanText = cleanText.replace("8-)", "<img src='" + tinymce_emoticon + "smiley-cool.gif' alt=''>");
    cleanText = cleanText.replace("o-)", "<img src='" + tinymce_emoticon + "smiley-innocent.gif' alt=''>");
    cleanText = cleanText.replace(":D", "<img src='" + tinymce_emoticon + "smiley-laughing.gif' alt=''>");
    cleanText = cleanText.replace(":mrgreen:", "<img src='../../../../img/smileys-mrgreen.gif' alt=''>");
    return cleanText;
}
