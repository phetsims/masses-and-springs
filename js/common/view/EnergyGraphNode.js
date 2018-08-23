// Copyright 2017-2018, University of Colorado Boulder

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
  var Dialog = require( 'SUN/Dialog' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );
  var ColorConstants = require( 'SUN/ColorConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var LEGEND_DESCRIPTION_MAX_WIDTH = 500;
  var MAX_WIDTH = 100;
  var GREEN_COLOR = '#39d74e';
  var BLUE_COLOR = '#5798de';
  var CYAN_COLOR = '#29d4ff';
  var ORANGE_COLOR = '#ee6f3e';

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

    // @private {Property.<number>} (read-write) Responsible for the zoom level in the bar graph.
    // This is adjusted by the zoom buttons and used for the scaling Property of the barNodes.
    this.zoomLevelProperty = new NumberProperty( 3 );

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

    // {DerivedProperty.<number>} Responsible for adjusting the scaling of the barNode heights.
    var scaleFactorProperty = new DerivedProperty( [ this.zoomLevelProperty ], function( zoomLevel ) {
      return Math.pow( 2, zoomLevel ) * 20;
    } );

    var clearThermalButton = new ClearThermalButton( {
      listener: function() {

        // We are setting a new initial total energy here because the thermal energy bar acts as if the system has
        // has been reset. Thermal energy is the only value that is dependent on initial total energy.
        var mass = model.firstSpring.massAttachedProperty.get();
        if ( mass ) {
          mass.initialTotalEnergyProperty.set( mass.kineticEnergyProperty.get() +
                                               mass.gravitationalPotentialEnergyProperty.get() +
                                               mass.elasticPotentialEnergyProperty.get() );
        }
      },
      scale: 0.7
    } );
    model.firstSpring.thermalEnergyProperty.link( function( value ) {
      clearThermalButton.enabled = ( value > 0 );
      clearThermalButton.pickable = ( value > 0 );
    } );

    var aEntry = {
      property: model.firstSpring.kineticEnergyProperty,
      color: GREEN_COLOR
    };
    var bEntry = {
      property: model.firstSpring.gravitationalPotentialEnergyProperty,
      color: BLUE_COLOR
    };
    var cEntry = {
      property: model.firstSpring.elasticPotentialEnergyProperty,
      color: CYAN_COLOR
    };
    var dEntry = {
      property: model.firstSpring.thermalEnergyProperty,
      color: ORANGE_COLOR
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
          color: GREEN_COLOR
        },
        {
          abbreviation: peGravString,
          description: gravitationalPotentialEnergyString,
          color: BLUE_COLOR
        }, {
          abbreviation: peElasString,
          description: elasticPotentialEnergyString,
          color: CYAN_COLOR
        }, {
          abbreviation: eThermString,
          description: thermalEnergyString,
          color: ORANGE_COLOR
        }, {
          abbreviation: eTotString,
          description: totalEnergyString,
          color: 'black'
        }
      ].map( function( itemData ) {
        return new HBox( {
          spacing: 20,
          children: [
            new AlignBox( new RichText( itemData.abbreviation, {
              font: MassesAndSpringsConstants.LEGEND_ABBREVIATION_FONT,
              fill: itemData.color,
              maxWidth: MAX_WIDTH
            } ), {
              group: abbreviationGroup,
              xAlign: 'left'
            } ),
            new AlignBox( new Text( itemData.description, {
              font: MassesAndSpringsConstants.LEGEND_DESCRIPTION_FONT
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

    // Button that pops up dialog box for the graph's legend
    var infoButton = new InfoButton( {
      maxHeight: 1.1 * zoomInButton.height,
      centerY: zoomOutButton.centerY,
      iconFill: 'rgb( 41, 106, 163 )',
      listener: function() {
        if ( !dialog ) {
          dialog = new Dialog( dialogContent, {
            modal: true,
            ySpacing: 20,
            bottomMargin: 20,
            title: new Text( energyLegendString, {
              font: new PhetFont( 22 ),
              maxWidth: MAX_WIDTH*2
            } )
          } );
        }

        // close it on a click
        var closeListener = new ButtonListener( {
          fire: dialog.hide.bind( dialog )
        } );
        dialog.addInputListener( closeListener );
        dialog.show();
      }
    } );

    // Display buttons at the bottom of the graph
    var displayButtons = new HBox( {
      spacing: 12,
      children: [ infoButton, new HStrut( 18 ), zoomOutButton, zoomInButton ]
    } );

    displayButtons.left = this.barChartNode.left;

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
    } );

    var accordionBoxContent = new VBox( {
      children: [
        chartNode,
        displayButtons
      ], spacing: 4
    } );

    AccordionBox.call( this, accordionBoxContent, {
      buttonYMargin: 4,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH+40 } )
    } );
    this.maxHeight = 720;
  }

  massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );

  return inherit( AccordionBox, EnergyGraphNode, {
    /**
     * @public
     */
    reset: function() {
      this.zoomLevelProperty.reset();
    },
    /**
     * @public
     */
    update: function() {
      this.barChartNode.update();
    }
  } );
} );
