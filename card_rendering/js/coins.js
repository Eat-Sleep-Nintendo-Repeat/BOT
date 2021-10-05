window.onload = () => {
    //fetch coins data
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch(params.base_url + `/coins/${params.user}`, {headers: {Authorization: `Token ${params.api_key}`}}).then(res => res.json()).then(data => {
        console.log(data)

        document.getElementById("profile_image").setAttribute("src", `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=2048`)
        document.getElementById("name").innerHTML = `${data.user.username}#${data.user.discriminator}`
        document.getElementById("typename").innerHTML = data.user.typeword

        if (data.user.booster) {
            document.getElementById("boosterbadge").setAttribute("style", "display: block;")
        }

        document.getElementById("camount").innerHTML = `Coins: ${data.coindata.amount}`

        document.getElementById("list").innerHTML = data.coindata.log.reverse().slice(0, 3).map(x => (`<li>
        <div class="buchung">
            <div class="value">
                <h5 style="color: ${x.value < 0 ? `var(--error)` : `var(--success)`};">${x.value}</h5>
                <img src="images/Eat Sleep Coin.svg" alt="Coins">
            </div>

            <h5 class="description">${x.description}</h5>
            <h5>${new window.Date(x.date).toLocaleDateString("DE-de")}</h5>
        </div>
    </li>`
    )).join("")


    if (data.coindata.log.length == 0) {
        document.getElementById("list").innerHTML =`<li>
        <div class="buchung">
            <div class="value">
                <h5></h5>
            </div>

            <h5 class="description">Keine Buchungen...</h5>
            <h5></h5>
        </div>
    </li>`
    }



        
    })
}