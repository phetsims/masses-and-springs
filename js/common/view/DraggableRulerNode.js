// Copyright 2017-2023, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the ruler node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const cmString = MassesAndSpringsStrings.cm;

class DraggableRulerNode extends RulerNode {

  /**
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property.<boolean>} visibleProperty
   * @param {function} endDragCallback
   * @param {Tandem} tandem
   */
  constructor( mvt, dragBounds, initialPosition, visibleProperty, endDragCallback, tandem ) {

    // define ruler params view units
    const rulerLength = mvt.modelToViewDeltaY( -1 ); // 1 meter
    const rulerWidth = 0.125 * rulerLength;
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < 10; i++ ) {
      majorTickLabels.push( '' );
      majorTickLabels.push( `${i * 10}` );
      assert && assert( majorTickLabels[ i * 2 ] === `${Math.floor( i * 10 )}` );
    }
    majorTickLabels.push( '' );
    majorTickLabels.push( '' );
    const majorTickWidth = rulerLength / ( majorTickLabels.length - 1 );

    super( rulerLength, rulerWidth, majorTickWidth, majorTickLabels, cmString, {
      insetsWidth: 0,
      minorTicksPerMajorTick: 4,
      unitsMajorTickIndex: 19,
      rotation: Math.PI / 2,
      backgroundFill: 'rgb( 237, 225, 121 )',
      cursor: 'pointer',
      majorTickFont: MassesAndSpringsConstants.LABEL_FONT,
      majorTickHeight: 10,
      minorTickHeight: 5,
      unitsFont: MassesAndSpringsConstants.LABEL_FONT,
      opacity: 0.8,
      tickMarksOnBottom: false
    }, { tandem: tandem.createTandem( 'ruler' ) } );

    // @private (read-only) - position of ruler node in screen coordinates
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );
    this.positionProperty.linkAttribute( this, 'translation' );

    // @public {Panel|null} (read-write) Used for returning ruler to toolbox. Set this if needed to be returned.
    this.toolbox = null;

    // @public {Property.<Boolean>} Flag used to determine if the user has dragged the ruler from its starting position.
    this.draggedProperty = new BooleanProperty( false );

    // @private {DragListener} (read-only) handles ruler node drag events
    this.rulerNodeDragListener = new DragListener( {
      positionProperty: this.positionProperty,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' ),
      dragBoundsProperty: new Property( dragBounds ),
      start: () => {
        this.draggedProperty.set( true );
        this.moveToFront();
      },
      end: () => {
        endDragCallback();
      }
    } );
    this.addInputListener( this.rulerNodeDragListener );

    visibleProperty.linkAttribute( this, 'visible' );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }
}

massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );
export default DraggableRulerNode;