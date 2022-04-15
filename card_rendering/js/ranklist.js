window.onload = () => {
    //fetch coins data
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    fetch(params.base_url + `/users/toplist?max=15`, {headers: {Authentication: `Token ${params.api_key}`}}).then(res => res.json()).then(data => {
        console.log(data)

        document.getElementById("date").innerHTML = new window.Date().toLocaleDateString("DE-de")


        document.getElementById("listui").innerHTML = data.map((x, index) => (`
        <div class="user box${index == 0 ? ` first` : index == 1 ? ` second` : index == 2 ? ` third` : ``}">
                    <div class="place">
                    ${index == 0 ? `<i class="twa twa-1st-place-medal"></i>` : index == 1 ? `<i class="twa twa-2nd-place-medal"></i>` : index == 2 ? `<i class="twa twa-3rd-place-medal"></i>` : `<h1>#${index + 1}</h1>`}
                    </div>

                    <div class="name">
                        <img class="pb" onerror="this.src='images/default-pb.jpg';" src="${x.avatar}">
                        <h1>${x.username}#${x.discriminator}</h1>
                        <p>${x.typeword}</p>
                        <img id="boosterbadge" style="display: ${x.serverbooster ? "block" : "none"};" src="images/nitro.png" alt="booster image">
                    </div>

                    <div class="rank">
                        <h1>Rank: ${x.rank}</h1>
                    </div>
                </div>
        `)).join("")


    })
}