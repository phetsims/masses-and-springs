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
  var BAR_NODE_WIDTH = 15;

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );
  var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );
  var kineticEnergyString = require( 'string!MASSES_AND_SPRINGS/kineticEnergy' );
  var keString = require( 'string!MASSES_AND_SPRINGS/ke' );
  var gravitationalPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/gravitationalPotentialEnergy' );
  var peGravString = require( 'string!MASSES_AND_SPRINGS/peGrav' );
  var elasticPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/elasticPotentialEnergy' );
  var peElasString = require( 'string!MASSES_AND_SPRINGS/peElas' );
  var thermalEnergyString = require( 'string!MASSES_AND_SPRINGS/thermalEnergy' );
  var eThermString = require( 'string!MASSES_AND_SPRINGS/eTherm' );
  var totalEnergyString = require( 'string!MASSES_AND_SPRINGS/totalEnergy' );
  var tTotString = require( 'string!MASSES_AND_SPRINGS/tTot' );
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

    // Create a scaled height for the bar to represent
    var createScaledBarHeightProperty = function( property ) {
      return new DerivedProperty( [ property, scaleFactorProperty ],
        function( value, scale ) {
          return Math.min( MAXIMUM_HEIGHT, Math.abs( value ) * scale );
        } );
    };

    // REVIEW: Since these are all of type Property, they should be named KEBarHeightProperty (for example).
    var KEBarHeightProperty = createScaledBarHeightProperty( model.masses.adjustableMass.kineticEnergyProperty );
    var GPEBarHeightProperty = createScaledBarHeightProperty( model.masses.adjustableMass.gravitationalPotentialEnergyProperty );
    var EPBarHeightProperty = createScaledBarHeightProperty( model.masses.adjustableMass.elasticPotentialEnergyProperty );

    // Creation of our different bar nodes to be represented in the graph
    // TODO: Factor out a function for this.
    // REVIEW: How about one function to create the property and the VerticalBarNode, since the properties don't appear to be used elsewhere?
    var kineticEnergyBarNode = new VerticalBarNode( KEBarHeightProperty, {
      fill: '#39d74e',
      width: BAR_NODE_WIDTH,
      displayContinuousArrow: true
    } );
    var gravitationalPotentialEnergyBarNode = new VerticalBarNode( GPEBarHeightProperty, {
      fill: '#5798de',
      width: BAR_NODE_WIDTH,
      displayContinuousArrow: true
    } );
    var elasticPotentialEnergyBarNode = new VerticalBarNode( EPBarHeightProperty, {
      fill: '#29d4ff',
      width: BAR_NODE_WIDTH,
      displayContinuousArrow: true
    } );

    this.barNodes = [
      kineticEnergyBarNode,
      gravitationalPotentialEnergyBarNode,
      elasticPotentialEnergyBarNode
    ];

    var compositeBar = new VerticalCompositeBarNode( this.barNodes, {
      width: BAR_NODE_WIDTH,
      displayContinuousArrow: true
    } );
    this.barNodes.push( compositeBar );

    // REVIEW: Seems unnecessary to pass in the font since it's always the same.
    var createLabelText = function( string, color, font ) {
      return new RichText( string, {
        fill: color,
        font: font
      } );
    };

    var sampleLabels = [
      createLabelText( keString, '#39d74e', MassesAndSpringsConstants.TITLE_FONT ),
      createLabelText( peGravString, '#5798de', MassesAndSpringsConstants.TITLE_FONT ),
      createLabelText( peElasString, '#29d4ff', MassesAndSpringsConstants.TITLE_FONT ),
      createLabelText( tTotString, 'black', MassesAndSpringsConstants.TITLE_FONT )
    ];

    sampleLabels.forEach( function( labelText ) {
      labelText.rotate( -Math.PI / 2 );
    } );

    var verticalBarChart = new VerticalBarChart( this.barNodes, {
      width: 140,
      height: MAXIMUM_HEIGHT,
      title: new Text( energyString, { maxWidth: 100 } ),
      titleFill: '#b37e46',
      xAxisLabels: null
    } );

    // Creation of zoom in/out buttons
    // REVIEW: With the exception of the 'in' key, all values are the same for both, so I recommend using a constant options object + _.extend.
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
        new Text( keString, { font: MassesAndSpringsConstants.FONT, fill: '#39d74e', maxWidth: MAX_WIDTH } ),
        new RichText( peGravString, { font: MassesAndSpringsConstants.FONT, fill: '#5798de', maxWidth: MAX_WIDTH } ),
        new RichText( peElasString, { font: MassesAndSpringsConstants.FONT, fill: '#29d4ff', maxWidth: MAX_WIDTH } ),
        new RichText( eThermString, { font: MassesAndSpringsConstants.FONT, fill: '#ff6e26', maxWidth: MAX_WIDTH } ),
        new RichText( tTotString, { font: MassesAndSpringsConstants.FONT, maxWidth: MAX_WIDTH } )
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
