// Copyright 2017-2020, University of Colorado Boulder

/**
 * Bar graph that represents the kinetic, potential, elastic potential, thermal, and total energy of the mass attached
 * to our spring system. This is a qualitative graph with x-axis labels, a legend, and zoom in/out functionality.
 * When a bar exceeds the y-axis an arrow is shown to indicate continuous growth.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import BarChartNode from '../../../../griddle/js/BarChartNode.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ZoomButton from '../../../../scenery-phet/js/buttons/ZoomButton.js';
import MoveToTrashButton from '../../../../scenery-phet/js/MoveToTrashButton.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';
import Dialog from '../../../../sun/js/Dialog.js';
import massesAndSpringsStrings from '../../masses-and-springs-strings.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

// constants
const LEGEND_DESCRIPTION_MAX_WIDTH = 500;
const MAX_WIDTH = 100;
const ORANGE_COLOR = '#ee6f3e';

const elasticPotentialEnergyString = massesAndSpringsStrings.elasticPotentialEnergy;
const energyGraphString = massesAndSpringsStrings.energyGraph;
const energyLegendString = massesAndSpringsStrings.energyLegend;
const eThermString = massesAndSpringsStrings.eTherm;
const eTotString = massesAndSpringsStrings.eTot;
const gravitationalPotentialEnergyString = massesAndSpringsStrings.gravitationalPotentialEnergy;
const keString = massesAndSpringsStrings.ke;
const kineticEnergyString = massesAndSpringsStrings.kineticEnergy;
const peElasString = massesAndSpringsStrings.peElas;
const peGravString = massesAndSpringsStrings.peGrav;
const thermalEnergyString = massesAndSpringsStrings.thermalEnergy;
const totalEnergyString = massesAndSpringsStrings.totalEnergy;

/**
 * @param {MassesAndSpringsModel} model
 * @param {Tandem} tandem
 * @constructor
 */
function EnergyGraphNode( model, tandem ) {
  const self = this;

  // @private {Property.<number>} (read-write) Responsible for the zoom level in the bar graph.
  // This is adjusted by the zoom buttons and used for the scaling Property of the barNodes.
  this.zoomLevelProperty = new NumberProperty( 3 );

  // Creation of zoom in/out buttons
  const zoomButtonOptions = {
    baseColor: ColorConstants.LIGHT_BLUE,
    xMargin: 8,
    yMargin: 4,
    radius: 7,
    touchAreaXDilation: 5,
    touchAreaYDilation: 5
  };
  const zoomInButton = new ZoomButton( merge( { in: true }, zoomButtonOptions ) );
  const zoomOutButton = new ZoomButton( merge( { in: false }, zoomButtonOptions ) );

  // Zooming out means bars and zoom level gets smaller.
  zoomOutButton.addListener( function() {
    self.zoomLevelProperty.value -= 1;
  } );

  // Zooming in means bars and zoom level gets larger.
  zoomInButton.addListener( function() {
    self.zoomLevelProperty.value += 1;
  } );

  // {Property.<number>} Responsible for adjusting the scaling of the barNode heights.
  const scaleFactorProperty = new DerivedProperty( [ this.zoomLevelProperty ], function( zoomLevel ) {
    return Math.pow( 2, zoomLevel ) * 20;
  } );

  const clearThermalButton = new MoveToTrashButton( {
    arrowColor: ORANGE_COLOR,
    listener: function() {

      // We are setting a new initial total energy here because the thermal energy bar acts as if the system has
      // been reset. Thermal energy is the only value that is dependent on initial total energy.
      const mass = model.firstSpring.massAttachedProperty.get();
      if ( mass ) {
        mass.initialTotalEnergyProperty.set( mass.kineticEnergyProperty.get() +
                                             mass.gravitationalPotentialEnergyProperty.get() +
                                             mass.elasticPotentialEnergyProperty.get() );
      }
    },
    scale: 0.7
  } );

  // Link exists for sim duration. No need to unlink.
  model.firstSpring.thermalEnergyProperty.link( function( value ) {
    clearThermalButton.enabled = ( value > 0 );
    clearThermalButton.pickable = ( value > 0 );
  } );

  const aEntry = {
    property: model.firstSpring.kineticEnergyProperty,
    color: PhetColorScheme.KINETIC_ENERGY
  };
  const bEntry = {
    property: model.firstSpring.gravitationalPotentialEnergyProperty,
    color: PhetColorScheme.GRAVITATIONAL_POTENTIAL_ENERGY
  };
  const cEntry = {
    property: model.firstSpring.elasticPotentialEnergyProperty,
    color: PhetColorScheme.ELASTIC_POTENTIAL_ENERGY
  };
  const dEntry = {
    property: model.firstSpring.thermalEnergyProperty,
    color: PhetColorScheme.HEAT_THERMAL_ENERGY
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

  const abbreviationGroup = new AlignGroup();
  const descriptionGroup = new AlignGroup();

  const dialogContent = new VBox( {
    spacing: 15,
    children: [
      {
        abbreviation: keString,
        description: kineticEnergyString,
        color: PhetColorScheme.KINETIC_ENERGY
      },
      {
        abbreviation: peGravString,
        description: gravitationalPotentialEnergyString,
        color: PhetColorScheme.GRAVITATIONAL_POTENTIAL_ENERGY
      }, {
        abbreviation: peElasString,
        description: elasticPotentialEnergyString,
        color: PhetColorScheme.ELASTIC_POTENTIAL_ENERGY
      }, {
        abbreviation: eThermString,
        description: thermalEnergyString,
        color: PhetColorScheme.HEAT_THERMAL_ENERGY
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
  let dialog = null;

  // Button that pops up dialog box for the graph's legend
  const infoButton = new InfoButton( {
    maxHeight: 1.1 * zoomInButton.height,
    centerY: zoomOutButton.centerY,
    iconFill: 'rgb( 41, 106, 163 )',
    listener: function() {
      if ( !dialog ) {
        dialog = new Dialog( dialogContent, {
          ySpacing: 20,
          bottomMargin: 20,
          title: new Text( energyLegendString, {
            font: new PhetFont( 22 ),
            maxWidth: MAX_WIDTH * 2
          } )
        } );
      }

      dialog.show();
    }
  } );

  // Display buttons at the bottom of the graph
  const displayButtons = new HBox( {
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

  const chartNode = new Node( {
    children: [ this.background, this.barChartNode ]
  } );

  const accordionBoxContent = new VBox( {
    children: [
      chartNode,
      displayButtons
    ], spacing: 4
  } );

  AccordionBox.call( this, accordionBoxContent, {
    buttonYMargin: 4,
    cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
    titleNode: new Text( energyGraphString, { font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: MAX_WIDTH + 40 } )
  } );
  this.maxHeight = 720;
}

massesAndSprings.register( 'EnergyGraphNode', EnergyGraphNode );

export default inherit( AccordionBox, EnergyGraphNode, {
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