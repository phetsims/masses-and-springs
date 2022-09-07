// Copyright 2017-2022, University of Colorado Boulder

/**
 * Panel that is responsible for adjusting the value of its corresponding mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const massString = MassesAndSpringsStrings.mass;
const massValueString = MassesAndSpringsStrings.massValue;

class MassValueControlPanel extends Panel {

  /**
   * @param {Mass} mass
   * @param {Node} massNodeIcon: icon that represents the mass to be adjusted
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( mass, massNodeIcon, tandem, options ) {
    assert && assert( mass.adjustable === true, 'MassValueControlPanel should only adjust a mass that is adjustable.' );

    options = merge( {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      fill: 'white',
      align: 'center',
      stroke: 'gray',
      yMargin: 6,
      xMargin: 6,
      tandem: tandem
    }, options );

    // range for mass in kg
    const range = new Range( 50, 300 );

    const massInGramsProperty = new DynamicProperty( new Property( mass.massProperty ), {
      bidirectional: true,
      map: mass => mass * 1000,
      inverseMap: massInGrams => massInGrams / 1000
    } );

    const trackSizeProperty = new Property( options.basics ? new Dimension2( 132, 0.1 ) : new Dimension2( 125, 0.1 ) );
    const valuePattern = StringUtils.fillIn( massValueString, { mass: SunConstants.VALUE_NAMED_PLACEHOLDER }, {
      font: new PhetFont( { size: 14, weight: 'bold' } )
    } );
    const numberControl = new NumberControl( massString, massInGramsProperty, range, {
      stroke: null,
      sliderIndent: 7,
      layoutFunction: NumberControl.createLayoutFunction4( {
        verticalSpacing: 8,
        arrowButtonsXSpacing: 5,
        hasReadoutProperty: new Property( true )
      } ),
      delta: 1,

      // subcomponent options
      numberDisplayOptions: {
        valuePattern: valuePattern,
        textOptions: {
          font: new PhetFont( 14 )
        },
        maxWidth: 100,
        useRichText: true,
        decimalPlaces: 0
      },
      titleNodeOptions: {
        font: new PhetFont( { size: 16, weight: 'bold' } ),
        maxWidth: 45
      },
      sliderOptions: {
        majorTickLength: 10,
        thumbSize: new Dimension2( 13, 24 ),
        thumbFill: '#00C4DF',
        thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
        thumbTouchAreaXDilation: 6,
        constrainValue: value => Utils.roundSymmetric( value / 10 ) * 10,
        majorTicks: [
          {
            value: range.min,
            label: new Text( String( range.min ), { font: new PhetFont( 14 ) } )
          },
          {
            value: range.max,
            label: new Text( String( range.max ), { font: new PhetFont( 14 ) } )
          }
        ],
        trackSize: trackSizeProperty.value
      },
      arrowButtonOptions: {
        scale: 0.5,
        touchAreaXDilation: 16,
        touchAreaYDilation: 26
      }
    } );
    const contentNode = new Node( { children: [ numberControl, massNodeIcon ] } );

    super( contentNode, options );

    massNodeIcon.leftTop = numberControl.leftTop.plus( new Vector2( 45, -2 ) );
    massNodeIcon.pickable = false;
  }
}

massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
export default MassValueControlPanel;