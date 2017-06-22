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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
  var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );
  var VerticalCompositeBarNode = require( 'GRIDDLE/VerticalCompositeBarNode' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );
  var Dialog = require( 'JOIST/Dialog' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var MAXIMUM_HEIGHT = 425;
  var LEGEND_DESCRIPTION_MAX_WIDTH = 250;
  var MAX_WIDTH = 150;

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );
  var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );
  var kineticEnergyString = require( 'string!MASSES_AND_SPRINGS/kineticEnergy' );
  var KEString = require( 'string!MASSES_AND_SPRINGS/KE' );
  var gravitationalPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/gravitationalPotentialEnergy' );
  var PeGravString = require( 'string!MASSES_AND_SPRINGS/PeGrav' );
  var elasticPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/elasticPotentialEnergy' );
  var PeElasString = require( 'string!MASSES_AND_SPRINGS/PeElas' );
  var thermalEnergyString = require( 'string!MASSES_AND_SPRINGS/thermalEnergy' );
  var EThermString = require( 'string!MASSES_AND_SPRINGS/ETherm' );
  var totalEnergyString = require( 'string!MASSES_AND_SPRINGS/totalEnergy' );
  var TTotString = require( 'string!MASSES_AND_SPRINGS/TTot' );
  var energyLegendString = require( 'string!MASSES_AND_SPRINGS/energyLegend' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergyGraphNode( model, tandem ) {

    // Zoom levels are based on powers of two (i.e. 1x, 2x, 4x, 8x, 16x). The Min/Max scales and scale factor
    // must always be a power of two.
    // TODO: Check this over with design team.
    var MIN_SCALE = 1;
    var MAX_SCALE = 32;

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

    var compositeBar = new VerticalCompositeBarNode( this.barNodes );
    // this.barNodes.push(compositeBar);

    var verticalBarChart = new VerticalBarChart( this.barNodes, {
      width: 140,
      height: MAXIMUM_HEIGHT,
      title: new Text( energyString, { maxWidth: 100 } ),
      titleFill: '#b37e46'
    } );

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

    // Manages the symbols used in the axes of the graph
    var symbolContent = new VBox( {
      children: [
        new Text( KEString, { font: MassesAndSpringsConstants.FONT, fill: '#39d74e', maxWidth: MAX_WIDTH } ),
        new RichText( PeGravString, { font: MassesAndSpringsConstants.FONT, fill: '#5798de', maxWidth: MAX_WIDTH } ),
        new RichText( PeElasString, { font: MassesAndSpringsConstants.FONT, fill: '#29d4ff', maxWidth: MAX_WIDTH } ),
        new RichText( EThermString, { font: MassesAndSpringsConstants.FONT, fill: '#ff6e26', maxWidth: MAX_WIDTH } ),
        new RichText( TTotString, { font: MassesAndSpringsConstants.FONT, maxWidth: MAX_WIDTH } )
      ], align: 'left', spacing: 10
    } );

    // Manages the description of the symbols

    var descriptionContent = new VBox( {
      children: [
        new Text( kineticEnergyString, { maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH } ),
        new Text( gravitationalPotentialEnergyString, { maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH } ),
        new Text( elasticPotentialEnergyString, { maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH } ),
        new Text( thermalEnergyString, { maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH } ),
        new Text( totalEnergyString, { maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH } )
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
        new Text( energyLegendString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } ),
        new AlignBox( content )
      ], spacing: 10
    } );

    // Button that pops up dialog box for the graph's legend
    var infoButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'info_circle', { scale: 0.55 } ),
      baseColor: '#E7E8E9',
      minWidth: 28,
      minHeight: 20,
      xMargin: 3,
      yMargin: 3
    } );
    infoButton.addListener( function() {
      new Dialog( dialogContent, { modal: true } ).show();
    } );

    var zoomReadout = new Text( scaleFactorProperty.get() + 'x', {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 18
    } );
    // Display buttons at the bottom of the graph
    var displayOptions = new HBox( {
      children: [ infoButton, new HStrut( 20 ), zoomReadout, zoomOutButton, zoomInButton ],
      spacing: 5
    } );

    // Provides a limit on the scale
    scaleFactorProperty.link( function( value ) {
      zoomReadout.text = (value + 'x');

      zoomOutButton.setEnabled( value !== MIN_SCALE );
      zoomInButton.setEnabled( value !== MAX_SCALE );
    } );

    // REVIEW: Not having an option for the accordion box gives me a tandem error.
    AccordionBox.call( this, new VBox( {
      children: [
        verticalBarChart,
        displayOptions
      ], spacing: 8
    } ), {
      titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } )
    } );
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
