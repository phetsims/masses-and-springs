// Copyright 2016, University of Colorado Boulder

/**
 * Bar graph that represents the kinetic, potential, elastic potential, thermal, and total energy of the mass attached
 * to our spring system. This is a qualitative graph with x-axis labels, a legend, and zoom in/out functionality.
 * When a bar exceeds the y-axis an arrow is shown to indicate continuous growth.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
    'use strict';

    // modules
    var AccordionBox = require( 'SUN/AccordionBox' );
    var AlignBox = require( 'SCENERY/nodes/AlignBox' );
    var DerivedProperty = require( 'AXON/DerivedProperty' );
    var Dialog = require( 'JOIST/Dialog' );
    var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
    var HBox = require( 'SCENERY/nodes/HBox' );
    var HStrut = require( 'SCENERY/nodes/HStrut' );
    var inherit = require( 'PHET_CORE/inherit' );
    var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
    var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Property = require( 'AXON/Property' );
    var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
    var RichText = require( 'SCENERY/nodes/RichText' );
    var Text = require( 'SCENERY/nodes/Text' );
    var VBox = require( 'SCENERY/nodes/VBox' );
    var VerticalBarChart = require( 'GRIDDLE/VerticalBarChart' );
    var VerticalBarNode = require( 'GRIDDLE/VerticalBarNode' );
    var VerticalCompositeBarNode = require( 'GRIDDLE/VerticalCompositeBarNode' );
    var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

    // constants
    var MAXIMUM_HEIGHT = 425;
    var LEGEND_DESCRIPTION_MAX_WIDTH = 250;
    var MAX_WIDTH = 150;
    var BAR_NODE_WIDTH = 15;
    var ZERO_PROPERTY = new Property( 0 );

    // strings
    var elasticPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/elasticPotentialEnergy' );
    var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );
    var energyLegendString = require( 'string!MASSES_AND_SPRINGS/energyLegend' );
    var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );
    var eThermString = require( 'string!MASSES_AND_SPRINGS/eTherm' );
    var gravitationalPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/gravitationalPotentialEnergy' );
    var keString = require( 'string!MASSES_AND_SPRINGS/ke' );
    var kineticEnergyString = require( 'string!MASSES_AND_SPRINGS/kineticEnergy' );
    var peElasString = require( 'string!MASSES_AND_SPRINGS/peElas' );
    var peGravString = require( 'string!MASSES_AND_SPRINGS/peGrav' );
    var thermalEnergyString = require( 'string!MASSES_AND_SPRINGS/thermalEnergy' );
    var totalEnergyString = require( 'string!MASSES_AND_SPRINGS/totalEnergy' );
    var tTotString = require( 'string!MASSES_AND_SPRINGS/tTot' );

    /**
     *
     * @param {MassesAndSpringsModel} model
     * @param {Tandem} tandem
     * @constructor
     */
    function EnergyGraphNode( model, tandem ) {

      // Zoom levels are based on powers of two (i.e. 1x, 2x, 4x, 8x, 16x). The Min/Max scales and scale factor
      // must always be a power of two.
      var MIN_SCALE = 1;
      var MAX_SCALE = 32;

      // {read-write} Responsible for the zoom level in the bar graph. Is adjusted by the zoom buttons and used for the
      // scaling property of the barNodes.
      var zoomLevelProperty = new Property( 0 );

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

      // TODO: Can we move this into the bar node? Ask JO
      // {read-write} Responsible for adjusting the scaling of the barNode heights.
      var scaleFactorProperty = new DerivedProperty( [ zoomLevelProperty ], function( zoomLevel ) {
        return Math.pow( 2, zoomLevel );
      } );

      /**
       * Creates a text for the labels to be placed on the x-axis.
       *
       * @param {String} string
       * @param {String} color
       * @returns {RichText}
       */
      function createLabelText( string, color ) {
        return new RichText( string, {
          fill: color,
          font: MassesAndSpringsConstants.TITLE_FONT
        } );
      }

      // Labels that are rotated and added to the bottom of the x-axis
      var xAxisLabels = [
        createLabelText( keString, '#39d74e' ),
        createLabelText( peGravString, '#5798de' ),
        createLabelText( peElasString, '#29d4ff' ),
        createLabelText( eThermString, '#ee6f3e' ),
        createLabelText( tTotString, 'black' )
      ];
      xAxisLabels.forEach( function( labelText ) {
        labelText.rotate( -Math.PI / 2 );
      } );

      /**
       * Creates a scaled height for the bar to represent
       *
       * @param {Property} property
       * @returns {DerivedProperty}
       */
      function createScaledHeightProperty( property ) {

        // Create a scaled height for the bar to represent
        return new DerivedProperty( [ property, scaleFactorProperty ],
          function( value, scale ) {
            return Math.min( MAXIMUM_HEIGHT, Math.abs( value ) * scale );
          } );
      }

      /**
       * Function that returns a barNode representing a property. BarNodes are initialized with a value of zero
       *
       * @param {Property} property
       * @param {String} fill
       * @returns {VerticalBarNode}
       */
      var createBarNode = function( property, fill ) {
        return new VerticalBarNode( property, {
          fill: fill,
          width: BAR_NODE_WIDTH,
          maxBarHeight: 350,
          displayContinuousArrow: true
        } );
      };

      // We are using scaled heights to represent our bar values
      var scaledKineticEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].kineticEnergyProperty );
      var scaledGravitationalPotentialEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].gravitationalPotentialEnergyProperty );
      var scaledElasticPotentialEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].elasticPotentialEnergyProperty );
      var scaledthermalEnergyProperty = createScaledHeightProperty( model.frictionProperty );

      // Creation of our different bar nodes to be represented in the graph on energy screen
      this.barNodes = [
        createBarNode( scaledKineticEnergyProperty, '#39d74e' ),
        createBarNode( scaledGravitationalPotentialEnergyProperty, '#5798de' ),
        createBarNode( scaledElasticPotentialEnergyProperty, '#29d4ff' ),
        createBarNode( scaledthermalEnergyProperty, '#ee6f3e' )
      ];

      // These properties are used for the composite bar node.
      var barProperties = [
        createScaledHeightProperty( model.masses[ 0 ].kineticEnergyProperty ),
        createScaledHeightProperty( model.masses[ 0 ].gravitationalPotentialEnergyProperty ),
        createScaledHeightProperty( model.masses[ 0 ].elasticPotentialEnergyProperty ),
        createScaledHeightProperty( model.frictionProperty )
      ];

      // Colors used for each bar. Consider that the first barColor will be applied to the first barNode.
      var barColors = [
        '#39d74e',
        '#5798de',
        '#29d4ff',
        '#ee6f3e'
      ];

      // Composite bar is used for the total energy readout in the energy graph.
      var compositeBar = new VerticalCompositeBarNode( barProperties, barColors, {
        width: BAR_NODE_WIDTH,
        displayContinuousArrow: true,
        arrowFill: 'black',
        maxBarHeight: 350
      } );
      this.barNodes.push( compositeBar );

      // The main body for the energy graph.
      var verticalBarChart = new VerticalBarChart( this.barNodes, {
        width: 140,
        height: MAXIMUM_HEIGHT,
        title: new Text( energyString, { maxWidth: 100 } ),
        titleFill: '#b37e46',
        xAxisLabels: xAxisLabels
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

      // Visual readout for the scale of the factor
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

      // REVIEW: Not having an option for the accordion box gives me a tandem error.
      AccordionBox.call( this, accordionBoxContent, {
        titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } )
      } );
      this.maxHeight = 490;
    }

    massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
    return inherit( AccordionBox, EnergyGraphNode );
  }
);
