// Copyright 2016-2017, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringView.call( this, model, tandem );
    this.gravityAndDampingControlPanel.gravityNumberDisplay.visible = false;
  }

  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( OneSpringView, EnergyScreenView );
} );