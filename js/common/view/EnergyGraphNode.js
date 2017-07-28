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
  var ZERO_PROPERTY = new Property( 0 );

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
  // TODO: Don't expose the whole model. We should only need the attachedMass.
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

    // Creates a text for the labels to be placed on the x-axis.
    var createLabelText = function( string, color ) {
      return new RichText( string, {
        fill: color,
        font: MassesAndSpringsConstants.TITLE_FONT
      } );
    };

    // Labels that are rotated and added to the bottom of the x-axis
    var xAxisLabels = [
      createLabelText( keString, '#39d74e' ),
      createLabelText( peGravString, '#5798de' ),
      createLabelText( peElasString, '#29d4ff' ),
      createLabelText( tTotString, 'black' )
    ];
    xAxisLabels.forEach( function( labelText ) {
      labelText.rotate( -Math.PI / 2 );
    } );

    // TODO: Add doc
    var scaleHeight = function( property, scaleFactorProperty ) {

      // Create a scaled height for the bar to represent
      return new DerivedProperty( [ property, scaleFactorProperty ],
        function( value, scale ) {
          return Math.min( MAXIMUM_HEIGHT, Math.abs( value ) * scale );
        } );
    };

    // TODO: Add doc
    // Function that returns a barNode representing a property.
    var createBarNode = function( property, fill ) {

      // Create a scaled height for the bar to represent
      var scaledHeightProperty = scaleHeight( property, scaleFactorProperty );
      return new VerticalBarNode( scaledHeightProperty, {
        fill: fill,
        width: BAR_NODE_WIDTH,
        maxBarHeight: 350,
        displayContinuousArrow: true
      } );
    };

    // Creation of our different bar nodes to be represented in the graph on energy screen
    var kineticEnergyBarNode = createBarNode( model.masses[ 0 ].kineticEnergyProperty, '#39d74e' );
    var gravitationalPotentialEnergyBarNode = createBarNode( model.masses[ 0 ].gravitationalPotentialEnergyProperty, '#5798de' );
    var elasticPotentialEnergyBarNode = createBarNode( model.masses[ 0 ].elasticPotentialEnergyProperty, '#29d4ff' );

    this.barNodes = [
      kineticEnergyBarNode,
      gravitationalPotentialEnergyBarNode,
      elasticPotentialEnergyBarNode
    ];

    var barProperties = [
      scaleHeight( model.masses[ 0 ].kineticEnergyProperty, scaleFactorProperty ),
      scaleHeight( model.masses[ 0 ].gravitationalPotentialEnergyProperty, scaleFactorProperty ),
      scaleHeight( model.masses[ 0 ].elasticPotentialEnergyProperty, scaleFactorProperty )
    ];
    var barColors = [
      '#39d74e',
      '#5798de',
      '#29d4ff'
    ];

    var compositeBar = new VerticalCompositeBarNode( barProperties, barColors, {
      width: BAR_NODE_WIDTH,
      displayContinuousArrow: true,
      arrowFill: 'black',
      maxBarHeight: 350
    } );
    this.barNodes.push( compositeBar );

    // The main body for the bar chart
    var verticalBarChart = new VerticalBarChart( this.barNodes, {
      width: 140,
      height: MAXIMUM_HEIGHT,
      title: new Text( energyString, { maxWidth: 100 } ),
      titleFill: '#b37e46',
      xAxisLabels: xAxisLabels
    } );

    // Creation of zoom in/out buttons
    var zoomButtonOptions = {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED'
    };
    var zoomInButton = new ZoomButton( _.extend( { in: true }, zoomButtonOptions ) );
    var zoomOutButton = new ZoomButton( _.extend( { in: false }, zoomButtonOptions ) );

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

    // a placeholder for the dialog - constructed lazily so that Dialog has access to
    // sim bounds
    var dialog = null;

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
      if ( !dialog ) {
        dialog = new Dialog( dialogContent, { modal: true } );
      }
      dialog.show();
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

    var accordionBoxContent = new VBox( {
      children: [
        verticalBarChart,
        displayOptions
      ], spacing: 8
    } );

    model.springs[ 0 ].massAttachedProperty.link( function( mass ) {

      if ( mass ) {
        kineticEnergyBarNode.setMonitoredProperty( mass.kineticEnergyProperty );
        gravitationalPotentialEnergyBarNode.setMonitoredProperty( mass.gravitationalPotentialEnergyProperty );
        elasticPotentialEnergyBarNode.setMonitoredProperty( mass.elasticPotentialEnergyProperty );
      }
      else {
        kineticEnergyBarNode.setMonitoredProperty( ZERO_PROPERTY );
        gravitationalPotentialEnergyBarNode.setMonitoredProperty( ZERO_PROPERTY );
        elasticPotentialEnergyBarNode.setMonitoredProperty( ZERO_PROPERTY );
      }

    } );
    // REVIEW: Not having an option for the accordion box gives me a tandem error.
    AccordionBox.call( this, accordionBoxContent, {
      titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } )
    } );
    this.maxHeight = 490;
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
  return inherit( AccordionBox, EnergyGraphNode );
} );
