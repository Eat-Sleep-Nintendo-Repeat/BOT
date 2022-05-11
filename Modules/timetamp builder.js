//export funktion
module.exports =  function MillisecondsToTimesamp(S, short) {
    //convert Milliseconds to Europian Time
    var ms = S % 1000;
    S = (S - ms) / 1000;
    var secs = S % 60;
    S = (S - secs) / 60;
    var mins = S % 60;
    S = (S - mins) / 60;
    var hrs = S % 24;
    S = (S - hrs) / 24;
    var days = S;
    
    //convert to string
    var output = "";
    if (days > 0) {
        output += `${days} Tage `;
    }

    if (short) {
        output = `${hrs > 0 ? hrs + ":" : ""}${mins}:${secs}`;
    }
    else {
        output += `${hrs === 0 ? "" : hrs < 10 ? "0" + hrs + ":" : hrs + ":"}${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
    }

    return output;

  
    }
