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
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
    var BarChartNode = require( 'GRIDDLE/BarChartNode' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var ClearThermalButton = require( 'SCENERY_PHET/ClearThermalButton' );
  var Color = require( 'SCENERY/util/Color' );
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
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
    var PushButtonIO = require( 'SUN/buttons/PushButtonIO' );

    // constants
  var LEGEND_DESCRIPTION_MAX_WIDTH = 500;
  var MAX_WIDTH = 100;

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
        xMargin: 8,
        yMargin: 4,
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

      // {read-write} Responsible for adjusting the scaling of the barNode heights.
      var scaleFactorProperty = new DerivedProperty( [ this.zoomLevelProperty ], function( zoomLevel ) {
        return Math.pow( 2, zoomLevel ) * 20;
      } );
      // var buttonCenter = barNodes[ options.thermalEnergyIndex ].centerX;

      var clearThermalButton = new ClearThermalButton( {
        listener: function() {

          // We are setting a new initial total energy here because the thermal energy bar acts as if the system has
          // has been reset. Thermal energy is the only value that is dependent on initial total energy.
          var mass = model.springs[ 0 ].massAttachedProperty.get();
          if ( mass ) {
            mass.initialTotalEnergyProperty.set( mass.kineticEnergyProperty.get() +
                                                 mass.gravitationalPotentialEnergyProperty.get() +
                                                 mass.elasticPotentialEnergyProperty.get() );
          }
        },
        scale: 0.7,
        enabled: false
      } );
      model.springs[ 0 ].thermalEnergyProperty.lazyLink( function( value ) {
        clearThermalButton.enabled = ( value > 0.001);
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
          labelString: eThermString,
          labelNode: clearThermalButton
        },
        {
          entries: [ aEntry, bEntry, cEntry, dEntry ],
          labelString: eTotString
        }
      ], new Property( new Range( -75, 435 ) ), {
        // TODO: Options here are not being used by sim. Why are common code options being used? Ask JO.
        barOptions: {
          totalRange: new Range( 0, 380 ),
          scaleProperty: scaleFactorProperty,
          xAxisOptions: {
            stroke: 'black',
            minPadding: 3,
            maxExtension: 4
          },
          barWidth: 18
        },
        labelBackgroundColor: new Color( 255, 255, 255, 0.7 ),
        barSpacing: 5
      } );

      var abbreviationGroup = new AlignGroup();
      var descriptionGroup = new AlignGroup();

      var dialogContent = new VBox( {
        spacing: 15,
        children: [
          {
            abbreviation: keString,
            description: kineticEnergyString,
            color: '#39d74e'
          },
          {
            abbreviation: peGravString,
            description: gravitationalPotentialEnergyString,
            color: '#5798de'
          }, {
            abbreviation: peElasString,
            description: elasticPotentialEnergyString,
            color: '#29d4ff'
          }, {
            abbreviation: eThermString,
            description: thermalEnergyString,
            color: '#ff6e26'
          }, {
            abbreviation: eTotString,
            description: totalEnergyString,
            color: 'black'
          },
        ].map( function( itemData ) {
          return new HBox( {
            spacing: 20,
            children: [
              new AlignBox( new RichText( itemData.abbreviation, {
                font: MassesAndSpringsConstants.TITLE_FONT,
                fill: itemData.color,
                maxWidth: MAX_WIDTH
              } ), {
                group: abbreviationGroup,
                xAlign: 'left'
              } ),
              new AlignBox( new Text( itemData.description, {
                font: MassesAndSpringsConstants.TITLE_FONT
              } ), {
                group: descriptionGroup,
                xAlign: 'left',
                maxWidth: LEGEND_DESCRIPTION_MAX_WIDTH
              } )
            ]
          } );
        } )
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
        maxWidth: zoomInButton.width - chromeBounds.width + 2 * iconPadding,
        maxHeight: zoomInButton.height - chromeBounds.height + 2 * iconPadding
      } );
      var infoButton = new RoundPushButton( {
        minXMargin: 5 + iconPadding,
        minYMargin: 5 + iconPadding,
        content: icon,
        baseColor: '#eee',
        centerY: zoomOutButton.centerY,
        listener: function() {
          if ( !dialog ) {
            dialog = new Dialog( dialogContent, {
              modal: true,
              title: new Text( energyLegendString, {
                font: MassesAndSpringsConstants.TITLE_FONT,
                maxWidth: MAX_WIDTH
              } )
            } );
          }
          // close it on a click
          var closeListener = new ButtonListener( {
            fire: dialog.hide.bind( dialog )
          } );
          dialog.addInputListener( closeListener );
          dialog.show();
        },
        phetioType: PushButtonIO,
        touchAreaXDilation: 10,
        touchAreaYDilation: 5
      } );

      // Display buttons at the bottom of the graph
      var displayButtons = new HBox( {
        children: [ infoButton, new HStrut( 30 ), zoomOutButton, new HStrut( 3 ), zoomInButton ],
        spacing: 5
      } );

      displayButtons.left = this.barChartNode.left;

      // Provides a limit on the scale
      scaleFactorProperty.link( function( value ) {
        zoomOutButton.setEnabled( value !== MIN_SCALE );
        zoomInButton.setEnabled( value !== MAX_SCALE );
      } );

      // Background for bar graph
      this.background = new Rectangle( 0, 0, 160, 520, {
        fill: 'white',
        stroke: 'gray',
        lineWidth: 0.8, // Empirically determined
        cornerRadius: 7
      } );
      this.barChartNode.center = this.background.center.plusXY( 0, 5 );

      var chartNode = new Node( {
          children: [ this.background, this.barChartNode ]
        }
      );

      var accordionBoxContent = new VBox( {
        children: [
          chartNode,
          displayButtons
        ], spacing: 4
      } );

      // TODO: Not having an option for the accordion box gives me a tandem error.
      AccordionBox.call( this, accordionBoxContent, {
        buttonYMargin: 4,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH } )
      } );
      this.maxHeight = 720;
    }

    massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );
    return inherit( AccordionBox, EnergyGraphNode, {
      /**
       * Resets the zoomLevelProperty of the zoom buttons.
       *
       * @public
       */
      reset: function() {
        this.zoomLevelProperty.reset();
      },
      /**
       * Calls the update() for the barChartNode
       *
       * @public
       */
      update: function() {
        this.barChartNode.update();
      }
    } );
  }
);
