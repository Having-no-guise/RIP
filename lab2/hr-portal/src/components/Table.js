import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave} from '@fortawesome/free-solid-svg-icons';
import { fetchData, addRecord, updateRecord, deleteRecord } from './api';


const TableContainer = styled.div`
  margin: 20px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StyledTable = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
  width: 100%;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #706d97;
  color: white;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #eee; /* Изменили цвет четных строк на #eee */
  }
`;

const AddRecordButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const AddRecordIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
`;

const AddRecordForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Input = styled.input`
  padding: 5px;
`;


const Table = ({ up_data, isLoggedIn}) => {
  const [data, setData] = useState([]);
  const [, setError] = useState(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    surname: '',
    name: '',
    patronym: '',
    birth_date: '',
  });
  const [isEditing, setIsEditing] = useState(null);
  const [editedRecord, setEditedRecord] = useState({
    surname: '',
    name: '',
    patronym: '',
    birth_date: '',
  });

  //const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  //setIsLoggedIn(!!localStorage.getItem('token'));
  console.log(localStorage.getItem('token'));
  console.log('at start loggedin is', isLoggedIn);
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Ошибка при загрузке данных');
      } 
    };

    fetchDataFromApi();
  }, []);


  useEffect(() => {
    // Ваши дополнительные действия при обновлении данных
    console.log('at update loggedin is', isLoggedIn);

    console.log('Table has been updated in Table component.');
    
  }, [up_data]);



  const handleAddRecord = () => {
    setIsAddingRecord(true);
  };

  const handleSaveRecord = async () => {
    console.log('SaveRecord button clicked');
    try {
      await addRecord(newRecord);
      var updatedData = await fetchData();
      updatedData = await fetchData();      
      setData(updatedData);
      setNewRecord({
        surname: '',
        name: '',
        patronym: '',
        birth_date: '',
      });
      setIsAddingRecord(false);
    }
    catch(error) {
        console.error('Error adding record:', error);
        setError('Ошибка при добавлении записи');
      };
  };

  const handleDelete = async (index) => {
    try {
      const recordToDelete = data[index];
      await deleteRecord(recordToDelete.id);
  
      var updatedData = await fetchData();
      updatedData = await fetchData();
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Ошибка при удалении записи');
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedRecord(data[index]);
  };

  const handleConfirmEdit = async () => {
    try {
      await updateRecord(editedRecord.id, editedRecord);
      
      var updatedData = await fetchData();
      updatedData = await fetchData();

      setData(updatedData);
      setIsEditing(null);
      setEditedRecord({
        surname: '',
        name: '',
        patronym: '',
        birth_date: '',
      });
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Ошибка при обновлении записи');
    }
  };

  const handleCancelEdit = () => {

    setIsEditing(null);
    setEditedRecord({
      surname: '',
      name: '',
      patronym: '',
      birth_date: '',
    });
  };

  const [isAddingRecordExpanded, setIsAddingRecordExpanded] = useState(true);

  const handleCollapseAddRecord = () => {
    setIsAddingRecordExpanded(false);
    setIsAddingRecord(false);
  };
  
  

  return (
    <TableContainer>
      {isLoggedIn && (
      <AddRecordButton onClick={handleAddRecord}>
        <AddRecordIcon icon={faPlus} />
        Добавить запись
      </AddRecordButton>
      )}
      {isAddingRecord && (
        <AddRecordForm>
          <Input
            type="text"
            placeholder="Фамилия"
            value={newRecord.surname}
            onChange={(e) => setNewRecord({ ...newRecord, surname: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Имя"
            value={newRecord.name}
            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Отчество"
            value={newRecord.patronym}
            onChange={(e) => setNewRecord({ ...newRecord, patronym: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Дата рождения"
            value={newRecord.birth_date}
            onChange={(e) => setNewRecord({ ...newRecord, birth_date: e.target.value })}
          />
          <button type="button" onClick={handleSaveRecord}>
            <FontAwesomeIcon icon={faSave} />
          </button>

          <button type="button" onClick={handleCollapseAddRecord}>
            Свернуть
          </button>

        </AddRecordForm>
      )}
      <StyledTable>
        <thead>
          <TableRow>
            <TableHeader>Фамилия</TableHeader>
            <TableHeader>Имя</TableHeader>
            <TableHeader>Отчество</TableHeader>
            <TableHeader>Дата рождения</TableHeader>
            <TableHeader>Действия</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {isEditing === index ? (
                  <Input
                    type="text"
                    value={editedRecord.surname}
                    onChange={(e) => setEditedRecord({ ...editedRecord, surname: e.target.value })}
                  />
                ) : (
                  item.surname
                )}
              </TableCell>
              <TableCell>
                {isEditing === index ? (
                  <Input
                    type="text"
                    value={editedRecord.name}
                    onChange={(e) => setEditedRecord({ ...editedRecord, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </TableCell>
              <TableCell>
                {isEditing === index ? (
                  <Input
                    type="text"
                    value={editedRecord.patronym}
                    onChange={(e) => setEditedRecord({ ...editedRecord, patronym: e.target.value })}
                  />
                ) : (
                  item.patronym
                )}
              </TableCell>
              <TableCell>
                {isEditing === index ? (
                  <Input
                    type="text"
                    value={editedRecord.birth_date}
                    onChange={(e) => setEditedRecord({ ...editedRecord, birth_date: e.target.value })}
                  />
                ) : (
                  item.birth_date
                )}
              </TableCell>
              <TableCell>
                {isLoggedIn && isEditing === index ? (
                  <>
                    <button onClick={handleConfirmEdit}>Подтвердить</button>
                    <button onClick={handleCancelEdit}>Отменить</button>
                  </>
                ) : (
                  <ActionButtons>
                        {isLoggedIn && (
                         <>
                             <button onClick={() => handleEdit(index)}>
                           <FontAwesomeIcon icon={faEdit} />
                         </button>
                         <button onClick={() => handleDelete(index)}>
                               <FontAwesomeIcon icon={faTrash} />
                    </button>
             </>
             )}
                  </ActionButtons>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;