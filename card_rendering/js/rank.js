window.onload = () => {
    //fetch coins data
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch(params.base_url + `/users/${params.user}`, {headers: {Authentication: `Token ${params.api_key}`}}).then(res => res.json()).then(data => {
        console.log(data)

        document.getElementById("profile_image").setAttribute("src", `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=2048`)
        document.getElementById("name").innerHTML = `${data.username}#${data.discriminator}`
        document.getElementById("typename").innerHTML = data.typeword

        if (data.serverbooster) {
            document.getElementById("boosterbadge").setAttribute("style", "display: block;")
        }

        if (data.private_page == false) {

        document.getElementById("rank").innerHTML = data.currencys.ranks.rank
        document.getElementById("xpprogress").innerHTML = `${data.currencys.ranks.xp} / ${data.currencys.ranks.rank * 5}`

        document.getElementById("xpbar").setAttribute("style", `width: ${data.currencys.ranks.xp / (data.currencys.ranks.rank * 5) * 100}%`)
        }

        else {
            document.getElementById("rank").innerHTML = `Geheim`
            document.getElementById("xpprogress").style = `display: none`
            document.getElementById("xpprogress").style = `display: none`
            document.querySelector("h4").innerHTML = `${data.username}'s Rang wird vor anderen verborgen`
            document.querySelector(".xp").style = "display: none"
    
            document.getElementById("xpbar").setAttribute("style", `display: none`)
        }

        
    })
}