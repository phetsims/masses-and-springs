// Copyright 2017, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorConstants = require( 'SUN/ColorConstants' );
    var DerivedProperty = require( 'AXON/DerivedProperty' );
    var Dialog = require( 'JOIST/Dialog' );
    var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
    var HBox = require( 'SCENERY/nodes/HBox' );
    var HStrut = require( 'SCENERY/nodes/HStrut' );
    var inherit = require( 'PHET_CORE/inherit' );
    var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
    var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
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
  var BAR_NODE_WIDTH = 17;
  var BAR_MAX_HEIGHT = 340;

    // strings
    var elasticPotentialEnergyString = require( 'string!MASSES_AND_SPRINGS/elasticPotentialEnergy' );
    var energyGraphString = require( 'string!MASSES_AND_SPRINGS/energyGraph' );
    var energyLegendString = require( 'string!MASSES_AND_SPRINGS/energyLegend' );
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
      var zoomLevelProperty = new Property( 3 );

      // Creation of zoom in/out buttons
      var zoomButtonOptions = {
        baseColor: ColorConstants.LIGHT_BLUE,
        xMargin: 3,
        yMargin: 3,
        radius: 7,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
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
          font: MassesAndSpringsConstants.TITLE_FONT,
          stroke: Color.toColor( color ).colorUtilsBrighter( 0.25 )
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
            return Math.min( MAXIMUM_HEIGHT, value * scale * 20 );
          } );
      }

      /**
       * Function that returns a barNode representing a property. BarNodes are initialized with a value of zero
       *
       * @param {DerivedProperty} property
       * @param {String} fill
       * @returns {VerticalBarNode}
       */
      function createBarNode( property, fill ) {
        return new VerticalBarNode( property, {
          fill: fill,
          width: BAR_NODE_WIDTH,
          maxBarHeight: BAR_MAX_HEIGHT,
          minBarHeight: 39,
          displayContinuousArrow: true
        } );
      }

      // We are using scaled heights to represent our bar values
      var scaledKineticEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].kineticEnergyProperty );
      var scaledGravitationalPotentialEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].gravitationalPotentialEnergyProperty );
      var scaledElasticPotentialEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].elasticPotentialEnergyProperty );
      var scaledThermalEnergyProperty = createScaledHeightProperty( model.springs[ 0 ].thermalEnergyProperty );

      // Creation of our different bar nodes to be represented in the graph on energy screen
      this.barNodes = [
        createBarNode( scaledKineticEnergyProperty, '#39d74e' ),
        createBarNode( scaledGravitationalPotentialEnergyProperty, '#5798de' ),
        createBarNode( scaledElasticPotentialEnergyProperty, '#29d4ff' ),
        createBarNode( scaledThermalEnergyProperty, '#ee6f3e' )
      ];

      // TODO: May be useful to make the property and color as one object with key value pair.
      // These properties are used for the composite bar node.
      var barProperties = [
        createScaledHeightProperty( model.springs[ 0 ].thermalEnergyProperty ),
        createScaledHeightProperty( model.springs[ 0 ].elasticPotentialEnergyProperty ),
        createScaledHeightProperty( model.springs[ 0 ].gravitationalPotentialEnergyProperty ),
        createScaledHeightProperty( model.springs[ 0 ].kineticEnergyProperty )
      ];

      // Colors used for each bar. Consider that the first barColor will be applied to the first barNode.
      var barColors = [
        '#ee6f3e',
        '#29d4ff',
        '#5798de',
        '#39d74e'
      ];

      // Composite bar is used for the total energy readout in the energy graph.
      var compositeBar = new VerticalCompositeBarNode( barProperties, barColors, {
        width: BAR_NODE_WIDTH,
        displayContinuousArrow: true,
        arrowFill: 'black',
        maxBarHeight: BAR_MAX_HEIGHT
      } );
      this.barNodes.push( compositeBar );

      // The main body for the energy graph.
      var verticalBarChart = new VerticalBarChart( this.barNodes, {
        width: 140,
        height: MAXIMUM_HEIGHT,
        titleFill: '#b37e46',
        xAxisLabels: xAxisLabels,
        thermalEnergyProperty: model.springs[ 0 ].thermalEnergyProperty,
        thermalEnergyListener: function() {

          // We are setting a new initial total energy here because the thermal energy bar acts as if the system has
          // has been reset. Thermal energy is the only value that is dependent on initial total energy.
          var mass = model.springs[ 0 ].massAttachedProperty.get();
          if ( mass ) {
            mass.initialTotalEnergyProperty.set( mass.kineticEnergyProperty.get() +
                                                 mass.gravitationalPotentialEnergyProperty.get() +
                                                 mass.elasticPotentialEnergyProperty.get() );
          }
        }
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

      // Because zoom buttons don't support getting internal size, and other buttons don't resize, we need to do a
      // hacky workaround to get their content to be the same size.
      var chromeBounds = new RoundPushButton( {
        content: new Node( { localBounds: new Bounds2( 0, 0, 0, 0 ) } )
      } ).bounds;

      // Button that pops up dialog box for the graph's legend
      var iconPadding = 1;
      var icon = new FontAwesomeNode( 'info_circle', {
        fill: 'hsl(208,60%,40%)',
        maxWidth: zoomInButton.width - chromeBounds.width - 2 * iconPadding,
        maxHeight: zoomInButton.height - chromeBounds.height - 2 * iconPadding
      } );
      var infoButton = new RoundPushButton( {
        minXMargin: 5 + iconPadding,
        minYMargin: 5 + iconPadding,
        content: icon,
        baseColor: '#eee',
        centerY: zoomOutButton.centerY,
        listener: function() {
          if ( !dialog ) {
            dialog = new Dialog( dialogContent, { modal: true } );
          }
          dialog.show();
        },
        touchAreaXDilation: 10,
        touchAreaYDilation: 5
      } );

      // Display buttons at the bottom of the graph
      var displayOptions = new HBox( {
        children: [ infoButton, new HStrut( 20 ), zoomOutButton, zoomInButton ],
        spacing: 5
      } );

      // Provides a limit on the scale
      scaleFactorProperty.link( function( value ) {
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
