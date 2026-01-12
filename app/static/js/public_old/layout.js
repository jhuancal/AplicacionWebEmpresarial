function loadPage(pageName) {
    fetch(`./${pageName}.html`)
        .then(res => res.text())
        .then(html => {
            var content = cambiarContenido(html);

            const scripts = content.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                newScript.src = oldScript.src;
                } else {
                newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
            });

            const externalScriptPath = `../static/js/scripts-${pageName}.js`;
            const script = document.createElement('script');
            script.src = externalScriptPath;
            
            document.body.appendChild(script);
        })
        .catch(err => {
            console.log(err);
            const contenido = "<p>Error al cargar la página.</p>";
            cambiarContenido(contenido);
        });
}

var cambiarContenido = function (contenido) {
    const mainElement = document.querySelector('main');
    const allElements = mainElement.querySelectorAll('*');
    allElements.forEach(element => {
        element.style.display = 'none';
    });
    mainElement.innerHTML = contenido;
    return mainElement;
}
