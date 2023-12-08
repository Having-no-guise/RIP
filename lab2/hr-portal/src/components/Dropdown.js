import React from 'react';
import styled from '@emotion/styled';

const DropdownContainer = styled.div`
  margin: 20px;
  text-align: center;
`;

const Dropdown = () => {
  return (
    <DropdownContainer>
      <label htmlFor="filial">Выберите филиал: </label>
      <select id="filial">
        <option value="filial1">г. Красноярск</option>
        {/* Добавьте другие филиалы по необходимости */}
      </select>
    </DropdownContainer>
  );
};

export default Dropdown;