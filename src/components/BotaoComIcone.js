// components/BotaoComIcone.js
import React from 'react';
import { Button } from '@mui/material';
import { Save, Delete, Edit, Add } from '@mui/icons-material';

const icones = {
  salvar: <Save />, // Ícone para salvar
  excluir: <Delete />, // Ícone para excluir
  editar: <Edit />,   // Ícone para editar
  adicionar: <Add />, // Ícone para adicionar
};

const BotaoComIcone = ({ tipo = 'salvar', texto, onClick, sx, ...props }) => {
  return (
    <Button
      variant="contained"
      startIcon={icones[tipo]}
      onClick={onClick}
      sx={{
        backgroundColor: tipo === 'excluir' ? '#dc3545' :
                         tipo === 'editar' ? '#17a2b8' :
                         tipo === 'adicionar' ? '#007bff' :
                         '#28a745',
        color: 'white',
        '&:hover': {
          backgroundColor: tipo === 'excluir' ? '#c82333' :
                           tipo === 'editar' ? '#138496' :
                           tipo === 'adicionar' ? '#0056b3' :
                           '#218838',
        },
        borderRadius: '5px',
        padding: '8px 16px',
        fontSize: '1rem',
        textTransform: 'none',
        ...sx
      }}
      {...props}
    >
      {texto}
    </Button>
  );
};

export default BotaoComIcone;
