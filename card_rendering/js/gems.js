window.onload = () => {
    //fetch gems data
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch(params.base_url + `/gems/${params.user}`, {headers: {Authentication: `Token ${params.api_key}`}}).then(res => res.json()).then(data => {
        console.log(data)

        document.getElementById("profile_image").setAttribute("src", `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=2048`)
        document.getElementById("name").innerHTML = `${data.user.username}#${data.user.discriminator}`
        document.getElementById("typename").innerHTML = data.user.typeword

        if (data.user.booster) {
            document.getElementById("boosterbadge").setAttribute("style", "display: block;")
        }

        document.getElementById("camount").innerHTML = `Gems: ${data.gemdata.amount}`

        document.getElementById("list").innerHTML = data.gemdata.log.reverse().slice(0, 3).map(x => (`<li>
        <div class="buchung">
            <div class="value">
                <h5 style="color: ${x.value < 0 ? `var(--error)` : `var(--success)`};">${x.value}</h5>
                <img src="images/Eat, Sleep, Gem.svg" alt="Gems">
            </div>

            <h5 class="description">${x.description}</h5>
            <h5>${new window.Date(x.date).toLocaleDateString("DE-de")}</h5>
        </div>
    </li>`
    )).join("")


    if (data.gemdata.log.length == 0) {
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