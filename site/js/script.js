document.addEventListener("DOMContentLoaded", () => {
	const details = document.querySelectorAll(".detail");

	function fermerDetail(detail) {
		detail.classList.remove("open");
		// Arrête la vidéo quand on ferme la section
		const video = detail.querySelector("video");
		if (video) video.pause();
	}

	// Ouverture : chaque vignette ouvre sa propre section
	document.querySelectorAll(".vignette").forEach((vignette) => {
		vignette.addEventListener("click", () => {
			const cible = document.getElementById(vignette.dataset.detail);
			if (!cible) return;

			// Ferme les autres sections pour n'en avoir qu'une d'ouverte
			details.forEach((d) => {
				if (d !== cible) fermerDetail(d);
			});

			cible.classList.add("open");
			cible.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	});

	// Fermeture : chaque croix ferme sa propre section
	details.forEach((detail) => {
		const fermer = detail.querySelector(".fermer");
		if (fermer) {
			fermer.addEventListener("click", (e) => {
				e.stopPropagation();
				fermerDetail(detail);
			});
		}
	});

	// Carrousel "À propos"
	const piste = document.querySelector(".piste");
	const versSecond = document.querySelector(".droitegauche");
	const versPremier = document.querySelector(".gauchedroite");

	if (piste && versSecond) {
		versSecond.addEventListener("click", () => piste.classList.add("page2"));
	}
	if (piste && versPremier) {
		versPremier.addEventListener("click", () => piste.classList.remove("page2"));
	}

	// Sons "cassette" : un seul lecteur partagé => jamais de superposition
	const lecteur = new Audio();
	lecteur.preload = "none";
	let boutonActif = null;

	function majBouton(bouton, actif) {
		bouton.classList.toggle("actif", actif);
		bouton.setAttribute("aria-pressed", actif ? "true" : "false");
		bouton.setAttribute("aria-label", actif ? "Arrêter le son" : "Lancer le son");
	}

	function arreterSon() {
		lecteur.pause();
		lecteur.currentTime = 0;
		if (boutonActif) {
			majBouton(boutonActif, false);
			boutonActif = null;
		}
	}

	document.querySelectorAll(".son").forEach((bouton) => {
		bouton.addEventListener("click", (e) => {
			e.stopPropagation();

			// Re-clic sur le son en cours : on l'arrête
			if (bouton === boutonActif) {
				arreterSon();
				return;
			}

			// Sinon on coupe l'éventuel son en cours et on lance le nouveau
			arreterSon();
			boutonActif = bouton;
			majBouton(bouton, true);
			lecteur.src = bouton.dataset.son;
			lecteur.play().catch(() => {
				if (boutonActif === bouton) arreterSon();
			});
		});
	});

	// Fin naturelle du son : le bouton repasse en "coupé"
	lecteur.addEventListener("ended", arreterSon);

	// Si on lance une vidéo de projet, on coupe la cassette
	document.querySelectorAll(".projetvideo").forEach((v) => {
		v.addEventListener("play", arreterSon);
	});
});