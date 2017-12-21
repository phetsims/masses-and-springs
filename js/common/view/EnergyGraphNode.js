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
    var BarChartNode = require( 'GRIDDLE/BarChartNode' );
    var DerivedProperty = require( 'AXON/DerivedProperty' );
    var Dialog = require( 'JOIST/Dialog' );
    var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
    var HBox = require( 'SCENERY/nodes/HBox' );
    var HStrut = require( 'SCENERY/nodes/HStrut' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Range = require( 'DOT/Range' );
    var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
    var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
    var RichText = require( 'SCENERY/nodes/RichText' );
    var Text = require( 'SCENERY/nodes/Text' );
    var VBox = require( 'SCENERY/nodes/VBox' );
    var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );
    var Bounds2 = require( 'DOT/Bounds2' );
    var ColorConstants = require( 'SUN/ColorConstants' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Property = require( 'AXON/Property' );
    var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

    // constants
    var LEGEND_DESCRIPTION_MAX_WIDTH = 250;
    var MAX_WIDTH = 150;

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
    var eTotString = require( 'string!MASSES_AND_SPRINGS/eTot' );

    /**
     *
     * @param {MassesAndSpringsModel} model
     * @param {Tandem} tandem
     * @constructor
     */
    function EnergyGraphNode( model, tandem ) {
      var self = this;

      // Zoom levels are based on powers of two (i.e. 1x, 2x, 4x, 8x, 16x). The Min/Max scales and scale factor
      // must always be a power of two.
      var MIN_SCALE = 1;
      var MAX_SCALE = 32;

      // {read-write} Responsible for the zoom level in the bar graph. Is adjusted by the zoom buttons and used for the
      // scaling property of the barNodes.
      this.zoomLevelProperty = new Property( 3 );

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
        self.zoomLevelProperty.value -= 1;
      } );

      // Zooming in means bars and zoom level gets larger.
      zoomInButton.addListener( function() {
        self.zoomLevelProperty.value += 1;
      } );

      // TODO: Can we move this into the bar node? Ask JO
      // {read-write} Responsible for adjusting the scaling of the barNode heights.
      var scaleFactorProperty = new DerivedProperty( [ this.zoomLevelProperty ], function( zoomLevel ) {
        return Math.pow( 2, zoomLevel )*20;
      } );

      var aEntry = {
        property: model.springs[ 0 ].kineticEnergyProperty,
        color: '#39d74e'
      };
      var bEntry = {
        property: model.springs[ 0 ].gravitationalPotentialEnergyProperty,
        color: '#5798de'
      };
      var cEntry = {
        property: model.springs[ 0 ].elasticPotentialEnergyProperty,
        color: '#29d4ff'
      };
      var dEntry = {
        property: model.springs[ 0 ].thermalEnergyProperty,
        color: '#ee6f3e'
      };

      this.barChartNode = new BarChartNode( [
        {
          entries: [ aEntry ],
          labelString: keString
        },
        {
          entries: [ bEntry ],
          labelString: peGravString
        },
        {
          entries: [ cEntry ],
          labelString: peElasString
        },
        {
          entries: [ dEntry ],
          labelString: eThermString
        },
        {
          entries: [ dEntry,cEntry, bEntry, aEntry ],
          labelString: eTotString
        }
      ], new Property( new Range( -100, 200 ) ), {
        barOptions: {
          totalRange: new Range( -100, 200 ),
          scaleProperty: scaleFactorProperty
        }
      } );

      // Manages the symbols used in the legend of the graph
      var symbolContent = new VBox( {
        children: [
          new Text( keString, { font: MassesAndSpringsConstants.FONT, fill: '#39d74e', maxWidth: MAX_WIDTH } ),
          new RichText( peGravString, { font: MassesAndSpringsConstants.FONT, fill: '#5798de', maxWidth: MAX_WIDTH } ),
          new RichText( peElasString, { font: MassesAndSpringsConstants.FONT, fill: '#29d4ff', maxWidth: MAX_WIDTH } ),
          new RichText( eThermString, { font: MassesAndSpringsConstants.FONT, fill: '#ff6e26', maxWidth: MAX_WIDTH } ),
          new RichText( eTotString, { font: MassesAndSpringsConstants.FONT, maxWidth: MAX_WIDTH } )
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
      var displayButtons = new HBox( {
        children: [ infoButton, new HStrut( 42 ), zoomOutButton, new HStrut( 3 ), zoomInButton ],
        spacing: 5
      } );

      displayButtons.left = this.barChartNode.left;

      // Provides a limit on the scale
      scaleFactorProperty.link( function( value ) {
        zoomOutButton.setEnabled( value !== MIN_SCALE );
        zoomInButton.setEnabled( value !== MAX_SCALE );
      } );

      var accordionBoxContent = new VBox( {
        children: [
          this.barChartNode,
          displayButtons
        ], spacing: 8
      } );

      // REVIEW: Not having an option for the accordion box gives me a tandem error.
      AccordionBox.call( this, accordionBoxContent, {
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } )
      } );
      this.maxHeight = 490;
    }

    massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
    return inherit( AccordionBox, EnergyGraphNode, {
      /**
       * TODO: add documentation
       */
      reset: function() {
        this.zoomLevelProperty.reset();
      },
      /**
       * TODO: add documentation
       */
      update: function(){
        this.barChartNode.update();
      }
    } );
  }
);
