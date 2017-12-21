// Copyright 2016-2017, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlPanel' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringView.call( this, model, tandem );
    var self = this;

    this.massNodes.forEach( function( massNode ) {
      massNode.vectorViewEnabled = true;
    } );

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.toolboxPanel.bottom + 55,
        left: this.gravityAndDampingControlPanel.left,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        showForces: false
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      vectorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
    } );
    this.gravityAndDampingControlPanel.options.readoutVisible = false;

  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );

  return inherit( OneSpringView, LabScreenView );
} );