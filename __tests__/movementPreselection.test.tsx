import React from 'react';

// Comprueba que al tocar Venta/Ingreso o Gasto, el formulario
// abre con el tipo correspondiente preseleccionado.
describe('Preselección del tipo en el formulario de movimiento', () => {
  const renderForm = async (initialType?: 'INGRESO' | 'EGRESO') => {
    const ReactTestRenderer = require('react-test-renderer');
    const { MovementForm } = require('../src/organisms/movements/MovementForm');
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<MovementForm onSubmit={jest.fn()} initialType={initialType} />);
    });
    return tree;
  };

  it('por defecto inicia en INGRESO', async () => {
    const tree = await renderForm();
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Guardar ingreso');
    expect(str).toContain('Venta del día');
  });

  it('respeta el tipo inicial EGRESO', async () => {
    const tree = await renderForm('EGRESO');
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Guardar gasto');
    expect(str).toContain('Compra de insumos');
    expect(str).not.toContain('Venta del día');
  });
});
