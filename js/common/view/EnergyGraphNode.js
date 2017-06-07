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
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
  var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );
  var Dialog = require( 'JOIST/Dialog' );
  var RichText = require( 'SCENERY_PHET/RichText' );

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

    // Manages the symbols used in the axes of the graph
    var symbolContent = new VBox( {
      children: [
        new Text( 'KE', { font: MassesAndSpringsConstants.FONT, fill: '#39d74e' } ),
        new RichText( 'PE<sub>' + 'grav' + '</sub>', { font: MassesAndSpringsConstants.FONT, fill: '#5798de' } ),
        new RichText( 'PE<sub>' + 'elas' + '</sub>', { font: MassesAndSpringsConstants.FONT, fill: '#29d4ff' } ),
        new RichText( 'E<sub>' + 'therm' + '</sub>', { font: MassesAndSpringsConstants.FONT, fill: '#ff6e26' } ),
        new RichText( 'E<sub>' + 'tot' + '</sub>', { font: MassesAndSpringsConstants.FONT } )
      ], align: 'left', spacing: 10
    } );

    // Manages the description of the symbols
    var descriptionContent = new VBox( {
      children: [
        new Text( 'Kinetic Energy' ),
        new Text( 'Gravitational Potential Energy' ),
        new Text( 'Elastic Potential Energy' ),
        new Text( 'Thermal Energy' ),
        new Text( 'Total Energy' )
      ], align: 'left', spacing: 15
    } );
    var content = new HBox( {
      children: [
        new AlignBox( symbolContent ),
        new HStrut( 20 ),
        new AlignBox( descriptionContent )
      ]
    } );
    var dialogContent = new VBox( {
      children: [
        new Text( 'Energy Legend', { font: MassesAndSpringsConstants.TITLE_FONT } ),
        new AlignBox( content )
      ], spacing: 10
    } );

    var infoButton = new RectangularPushButton();
    infoButton.addListener( function() {
      new Dialog( dialogContent, { modal: true } ).show();
    } );
    var displayButtons = new HBox( {
      children: [ infoButton, new HStrut( 40 ), zoomInButton, zoomOutButton ],
      spacing: 5
    } );

    AccordionBox.call( this, new VBox( {
      children: [
        new VerticalBarChart( barNodes, { width: 140, height: 400 } ),
        displayButtons
      ], spacing: 8
    } ), {
      titleNode: new Text( 'Energy Graph' )
    } );
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
