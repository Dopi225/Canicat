export const handlePageChange = (page, setPage, wrapperRef, morphRef) => {
    setPage(page);
    setTimeout(() => {
      if (!wrapperRef.current || !morphRef.current) return;
      const active = wrapperRef.current.querySelector(`button[data-page="${page}"]`);
      if (!active) return;
  
      const { left, top, width, height, borderRadius } = active.getBoundingClientRect();
      const { left: wLeft, top: wTop } = wrapperRef.current.getBoundingClientRect();
  
      morphRef.current.style.width = `${width}px`;
      morphRef.current.style.height = `${height}px`;
      morphRef.current.style.transform = `translate(${left - wLeft}px, ${top - wTop}px)`;
      morphRef.current.style.borderRadius = borderRadius;
      morphRef.current.classList.add('visible');
  
      setTimeout(() => morphRef.current?.classList.add('has-transition'), 10);
    }, 0);
  };
  
export const renderPagination = (total, current, wrapperRef, morphRef, onChange) => {
  const buttons = [];
  const maxButtonsPerLine = 10; // Nombre maximum de boutons par ligne

  // Calculer le nombre total de lignes nécessaires
  const totalLines = Math.ceil(total / maxButtonsPerLine);

  // Créer les boutons de pagination
  for (let line = 0; line < totalLines; line++) {
    const startPage = line * maxButtonsPerLine + 1; // Page de début pour cette ligne
    const endPage = Math.min(startPage + maxButtonsPerLine - 1, total); // Page de fin pour cette ligne

    // Créer un conteneur pour chaque ligne de pagination
    const lineButtons = [];
    for (let page = startPage; page <= endPage; page++) {
      lineButtons.push(
        <li key={page} className={`page-item ${current === page ? 'active' : ''}`}>
          <button className="page-link" data-page={page} onClick={() => onChange(page)}>
            {page}
          </button>
        </li>
      );
    }

    // Ajouter la ligne de boutons à la liste principale
    buttons.push(
      <ul key={line} className="pagination" style={{ display: 'flex', listStyle: 'none', padding: 0, margin: '0 0 8px 0' }}>
        {lineButtons}
      </ul>
    );
  }

  return (
    <nav className="position-relative" ref={wrapperRef}>
      {buttons}
      <div ref={morphRef} className="morph-bg"></div>
    </nav>
  );
};


  