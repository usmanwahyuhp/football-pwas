// let base_url = "https://api.football-data.org/v2/competitions/CL/";
let base_url = "https://api.football-data.org/v2/";
const token = "b931f071ccc548bda3870d2b63107506";

let fetchApi = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": token,
    },
  });
};

//block jika fetch berhasil hore
function status(response) {
  if (response.status !== 200) {
    console.log("Error: " + response.status);
    //method reject agar block catch ter-panggil
    return Promise.reject(new Error(response.statusText));
  } else {
    //objek ke promise untuk keperluan then
    return Promise.resolve(response);
  }
}

//parsing json to array js
function json(response) {
  return response.json();
}

//handle error di block catch
function error(error) {
  //parameter error dari promise.reject
  console.log("Error: " + error);
}

//request data json Team
function getTeams() {
  if ("caches" in window) {
    caches.match(base_url + "competitions/CL/teams").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("data getTeams from chaches");
          console.log(data);
          let teamsHTML = "";
          let club = data.teams;
          club.slice(0, 6).forEach(function (team, index) {
            team = JSON.parse(JSON.stringify(team).replace(/http:/g, "https:"));
            teamsHTML += `
                  <div  class="col s12 m6 l4">
                    <a href="../pages/detail.html?id=${team.id}">
                      <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                          <img class="activator" src="${team.crestUrl}">
                        </div>
                        <div class="card-content">
                          <p class="card-title activator grey-text text-darken-4">${team.name}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                `;
          });
          document.getElementById("teams").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetchApi(base_url + "competitions/CL/teams")
    .then(status)
    .then(json)
    .then(function (data) {
      //objek/array dari response.json masuk lewat data yes
      //susun komponen card secara dinamis
      let teamsHTML = "";
      let club = data.teams;
      club.slice(0, 6).forEach(function (team, index) {
        team = JSON.parse(JSON.stringify(team).replace(/http:/g, "https:"));
        teamsHTML += `
              <div  class="col s12 m6 l4">
                <a href="../pages/detail.html?id=${team.id}">
                  <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${team.crestUrl}">
                    </div>
                    <div class="card-content">
                      <p class="card-title activator grey-text text-darken-4">${team.name}</p>
                    </div>
                  </div>
                </a>
              </div>
            `;
      });
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

// Request detail team
function getTeamByid() {
  return new Promise(function (resolve, reject) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");
    console.log("masuk getTeamById");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParams).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log("data getTeamById from chaches");
            console.log(data);
            let teamHTML = "";
            teamHTML += `
            <div class="team-detail center">
              <img class="responsive-img" src="${data.crestUrl}">
              <h4>${data.name}</h4>
              <table>
                  <tr>
                    <th>Country</th>
                    <td>${data.area.name}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>${data.address}</td>
                  </tr>
                  <tr>
                    <th>Website</th>
                    <td>${data.website}</td>
                  </tr>
                  <tr>
                    <th>Stadium</th>
                    <td>${data.venue}</td>
                  </tr>
                  <tr>
                    <th>Founded</th>
                    <td>${data.founded}</td>
                  </tr>
                  <tr>
                    <th>Club Colour</th>
                    <td>${data.clubColors}</td>
                  </tr>
              </table>
            </div>
        `;
            document.getElementById("team").innerHTML = teamHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(base_url + "teams/" + idParams)
      .then(status)
      .then(json)
      .then(function (data) {
        // console.log(data);
        let teamHTML = "";
        teamHTML += `
        <div class="team-detail center">
          <img class="responsive-img" src="${data.crestUrl}">
          <h4>${data.name}</h4>
          <table>
              <tr>
                <th>Country</th>
                <td>${data.area.name}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>${data.address}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>${data.website}</td>
              </tr>
              <tr>
                <th>Stadium</th>
                <td>${data.venue}</td>
              </tr>
              <tr>
                <th>Founded</th>
                <td>${data.founded}</td>
              </tr>
              <tr>
                <th>Club Colour</th>
                <td>${data.clubColors}</td>
              </tr>
          </table>
        </div>
    `;
        document.getElementById("team").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      })
      .catch(error);
  });
}

function getSavedTeams() {
  getAll().then(function (teams) {
    console.log("data getAll:");
    console.log(teams);
    // Menyusun komponen card team secara dinamis
    let teamsHTML = "";
    teams.forEach(function (team) {
      teamsHTML += `
                    <div  class="col s12 m6 l4">
                      <a href="../pages/detail.html?id=${team.id}&saved=true">
                        <div class="card">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="${team.crestUrl}">
                          </div>
                          <div class="card-content">
                            <p class="card-title activator grey-text text-darken-4">${team.name}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #teams
    document.getElementById("saves").innerHTML = teamsHTML;
  });
}

function getSavedTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  console.log("idParam getSavedById = " + idParam);

  getById(idParam).then(function (teams) {
    console.log("masuk getSavedTeamByID");
    console.log(teams);
    let teamHTML = "";
    teamHTML += `
    <div class="team-detail center">
      <img class="responsive-img" src="${teams.crestUrl}">
      <h4>${teams.name}</h4>
      <table>
          <tr>
            <th>Country</th>
            <td>${teams.area.name}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>${teams.address}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td>${teams.website}</td>
          </tr>
          <tr>
            <th>Stadium</th>
            <td>${teams.venue}</td>
          </tr>
          <tr>
            <th>Founded</th>
            <td>${teams.founded}</td>
          </tr>
          <tr>
            <th>Club Colour</th>
            <td>${teams.clubColors}</td>
          </tr>
      </table>
    </div>
`;
    document.getElementById("team").innerHTML = teamHTML;
  });
}

function getClassement() {
  fetchApi(base_url + "competitions/CL/standings?standingType=TOTAL")
    .then(status)
    .then(json)
    .then(function (data) {
      //objek/array dari response.json masuk lewat data yes
      //susun komponen card secara dinamis
      // let classementHTML = "";
      let club = data.standings;
      // let group = data.standings.group;
      console.log(club);

      let classementHTML = "";
      let tableHTML = "";
      let groupHTML = "";
      let groupTableHTML = "";

      club.forEach(function (team, index) {
        let table = team.table;
        console.log(team.group);
        console.log(table);
        let group = team.group;

        groupHTML += `
          <td>${team.group}</td>
        `;

        table.forEach(function (klasemen, index) {
          console.log(klasemen.position);

          classementHTML += `
              <tr>
                <td>${klasemen.position}</td>
                <td>${klasemen.team.name}</td>
                <td>${klasemen.playedGames}</td>
                <td>${klasemen.won}</td>
                <td>${klasemen.draw}</td>
                <td>${klasemen.lost}</td>
                <td>${klasemen.points}</td>
                <td>${klasemen.goalsFor}</td>
              </tr>
        `;
        });
        groupTableHTML +=
          `
          <h4>${group}</h4>
          <table>
          <tr>
            <th class="center-align">Position</th>
            <th>Team</th>
            <th class="center-align">Played</th>
            <th class="center-align">Won</th>
            <th class="center-align">Draw</th>
            <th class="center-align">Lost</th>
            <th class="center-align">GF</th>
            <th class="center-align">GA</th>
          </tr> ` +
          classementHTML +
          `
          </table>
        `;
        document.getElementById("classement").innerHTML = groupTableHTML;
        classementHTML = "";
      });
    })
    .catch(error);
}
