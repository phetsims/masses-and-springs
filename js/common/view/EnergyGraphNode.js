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

  // strings
  var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergyGraphNode( model, tandem ) {

    var self = this;

    // Creation of our different bar nodes to be represented in the graph
    // TODO: Factor out a function for this.
    var kineticEnergyBarNode = new VerticalBarNode( model.masses.adjustableMass.massProperty, {
      fill: '#39d74e',
      width: 15
    } );
    var gravitationalPotentialEnergyBarNode = new VerticalBarNode( model.springs[ 0 ].springConstantProperty, {
      fill: '#5798de',
      width: 15
    } );
    var elasticPotentialEnergyBarNode = new VerticalBarNode( model.frictionProperty, { fill: '#29d4ff', width: 15 } );
    var thermalEnergyBarNode = new VerticalBarNode( model.gravityProperty, { fill: '#ff6e26', width: 15 } );
    var totalEnergyBarNode = new VerticalBarNode( model.gravityProperty, { fill: 'black', width: 15 } );

    this.barNodes = [
      kineticEnergyBarNode,
      gravitationalPotentialEnergyBarNode,
      elasticPotentialEnergyBarNode,
      thermalEnergyBarNode,
      totalEnergyBarNode
    ];

    var verticalBarChart = new VerticalBarChart( this.barNodes, { width: 140, height: 425 } );

    // Creation of zoom in/out buttons
    var zoomInButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: true
    } );
    var zoomOutButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: false
    } );

    zoomOutButton.addListener( function() {
      self.barNodes.forEach( function( bar ) {
        bar.rectangleNode.setRectHeight( Math.min( verticalBarChart.maximumHeight, bar.rectangleNode.rectHeight *= .3 ) );
        bar.rectangleNode.bottom = 0;
      } );
    } );

    zoomInButton.addListener( function() {
      self.barNodes.forEach( function( bar ) {
        bar.rectangleNode.setRectHeight( Math.min( verticalBarChart.maximumHeight, bar.rectangleNode.rectHeight /= .3 ) );
        bar.rectangleNode.bottom = 0;
      } );
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

    // Used to separate the symbols from their corresponding descriptions.
    var content = new HBox( {
      children: [
        new AlignBox( symbolContent ),
        new HStrut( 20 ),
        new AlignBox( descriptionContent )
      ]
    } );

    // Dialog that contains text for graph legend
    var dialogContent = new VBox( {
      children: [
        new Text( 'Energy Legend', { font: MassesAndSpringsConstants.TITLE_FONT } ),
        new AlignBox( content )
      ], spacing: 10
    } );

    // Button that pops up dialog box for the graph's legend
    var infoButton = new RectangularPushButton( {
      baseColor: '#E7E8E9',
      minWidth: 28,
      minHeight: 20,
      xMargin: 3,
      yMargin: 3
    } );
    infoButton.addListener( function() {
      new Dialog( dialogContent, { modal: true } ).show();
    } );

    // Display buttons at the bottom of the graph
    var displayButtons = new HBox( {
      children: [ infoButton, new HStrut( 40 ), zoomOutButton, zoomInButton ],
      spacing: 5
    } );

    AccordionBox.call( this, new VBox( {
      children: [
        verticalBarChart,
        displayButtons
      ], spacing: 8
    } ), {
      titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT } )
    } );
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
