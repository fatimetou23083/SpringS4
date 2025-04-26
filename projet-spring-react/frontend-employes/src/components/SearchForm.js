import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [searchType, setSearchType] = useState('nom');
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchType, searchValue);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="nom">Nom</option>
          <option value="departement">Département</option>
          <option value="salaire">Salaire minimum</option>
        </select>
        <input 
          type={searchType === 'salaire' ? 'number' : 'text'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={`Rechercher par ${searchType}`}
        />
        <button type="submit">Rechercher</button>
      </form>
    </div>
  );
}

export default SearchForm;