// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/energy/view/VectorVisibilityControlPanel' );

  /**
   * @param {EnergyModel} model
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    // Unique attributes of screen added here...
    this.toolboxPanel.top = 350;
    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: self.topSpacing,
        left: self.secondSpringConstantControlPanel.right + 10,
        maxWidth: 180
      } );
  }

  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( TwoSpringView, EnergyScreenView );
} );