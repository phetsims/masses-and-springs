// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
  var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergyGraphNode( model, tandem ) {
    var barNodes = [
      new VerticalBarNode( model.masses.adjustableMass.massProperty, { fill: 'red', width: 15 } ),
      new VerticalBarNode( model.springs[ 0 ].springConstantProperty, { fill: 'black', width: 15 } ),
      new VerticalBarNode( model.frictionProperty, { fill: 'orange', width: 15 } ),
      new VerticalBarNode( model.gravityProperty, { width: 15 } )
    ];
    var zoomInButton = new ZoomButton( {
      baseColor: '#FFD333',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: false
    } );
    var zoomOutButton = new ZoomButton( {
      baseColor: '#FFD333',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: true
    } );

    var infoButton = new RectangularPushButton();
    infoButton.addListener( function() {
      console.log( 'You pushed me' );
    } );
    var displayButtons = new HBox( { children: [ infoButton, zoomInButton, zoomOutButton ] } );

    AccordionBox.call( this, new VBox( {
      children: [
        new VerticalBarChart( barNodes, { width: 140, height: 400 } ),
        displayButtons
      ]
    } ), {
      titleNode: new Text( 'Energy Graph' )
    } );
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
