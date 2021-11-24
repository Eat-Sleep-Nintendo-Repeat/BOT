window.onload = () => {
    //fetch gems data
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

        if (data.private_page) {document.getElementById("camount").innerHTML = `Geheim`}
        else {document.getElementById("camount").innerHTML = `Gems: ${data.currencys.gems.amount}`}

        if (data.private_page == false) {
            document.getElementById("list").innerHTML = data.currencys.gems.log.reverse().slice(0, 3).map(x => (`<li>
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


        if (data.currencys.gems.log.length == 0) {
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
    }
    else {
        document.getElementById("listtitle").innerHTML = null
        document.getElementById("list").innerHTML =`<li>
            <h5 class="description" style="">${data.username} hat Gems und Ausgaben vor anderen verborgen</h5>
        </div>
    </li>`
    }



        
    })
}