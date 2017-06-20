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
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
  var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );
  var Dialog = require( 'JOIST/Dialog' );
  var RichText = require( 'SCENERY_PHET/RichText' );

  // constants
  var MAXIMUM_HEIGHT = 425;

  // strings
  var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergyGraphNode( model, tandem ) {

    // Zoom levels are based on powers of two (i.e. 1x, 2x, 4x, 8x, 16x). The Min/Max scales and scale factor
    // must always be a power of two.
    // TODO: Check this over with design team.
    var MIN_SCALE = 1;
    var MAX_SCALE = 8;


    //Add documentation
    var zoomLevelProperty = new Property( 0 );

    var scaleFactorProperty = new DerivedProperty( [ zoomLevelProperty ], function( zoomLevel ) {
      return Math.pow( 2, zoomLevel );
    } );

    var createScaledBarHeight = function( property ) {
      var derivedProperty = new DerivedProperty( [ property, scaleFactorProperty ],
        function( value, scale ) {
          return Math.min( MAXIMUM_HEIGHT, Math.abs( value ) * scale );
        } );
      return derivedProperty;
    };

    var KEBarHeight = createScaledBarHeight( model.masses.adjustableMass.massProperty );
    var GPEBarHeight = createScaledBarHeight( model.springs[ 0 ].springConstantProperty );
    var EPBarHeight = createScaledBarHeight( model.frictionProperty );
    var ThermalEnergyBarHeight = createScaledBarHeight( model.masses.adjustableMass.verticalVelocityProperty );
    var TotalEnergyBarHeight = createScaledBarHeight( model.gravityProperty );

    // Creation of our different bar nodes to be represented in the graph
    // TODO: Factor out a function for this.
    var kineticEnergyBarNode = new VerticalBarNode( KEBarHeight, {
      fill: '#39d74e',
      width: 15,
      displayContinuousArrow: true
    } );
    var gravitationalPotentialEnergyBarNode = new VerticalBarNode( GPEBarHeight, {
      fill: '#5798de',
      width: 15,
      displayContinuousArrow: true
    } );
    var elasticPotentialEnergyBarNode = new VerticalBarNode( EPBarHeight, {
      fill: '#29d4ff',
      width: 15,
      displayContinuousArrow: true
    } );
    var thermalEnergyBarNode = new VerticalBarNode( ThermalEnergyBarHeight, {
      fill: '#ff6e26',
      width: 15,
      displayContinuousArrow: true
    } );
    var totalEnergyBarNode = new VerticalBarNode( TotalEnergyBarHeight, {
      fill: 'black',
      width: 15,
      displayContinuousArrow: true
    } );

    this.barNodes = [
      kineticEnergyBarNode,
      gravitationalPotentialEnergyBarNode,
      elasticPotentialEnergyBarNode,
      thermalEnergyBarNode,
      totalEnergyBarNode
    ];

    var verticalBarChart = new VerticalBarChart( this.barNodes, { width: 140, height: MAXIMUM_HEIGHT } );

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

    // Zooming out means bars and zoom level gets smaller.
    zoomOutButton.addListener( function() {
      zoomLevelProperty.value -= 1;
    } );

    // Zooming in means bars and zoom level gets larger.
    zoomInButton.addListener( function() {
      zoomLevelProperty.value += 1;
    } );

    // Provides a limit on the scale
    scaleFactorProperty.link( function( value ) {
      zoomOutButton.setEnabled( value !== MIN_SCALE );
      zoomInButton.setEnabled( value !== MAX_SCALE );
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
