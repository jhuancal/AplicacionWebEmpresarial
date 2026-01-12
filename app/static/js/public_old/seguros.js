document.addEventListener('DOMContentLoaded', () => {
    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            const beneficios = document.getElementById('beneficios');
            if (beneficios) {
                beneficios.style.display = beneficios.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
});
