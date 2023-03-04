// Copyright 2017-2023, University of Colorado Boulder

/**
 * Responsible for the toolbox panel and the ruler/timer icons held within
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import { AlignBox, DragListener, HBox, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

class ToolboxPanel extends Panel {

  /**
   * @param {Stopwatch} stopwatch
   * @param {Bounds2} dragBounds
   * @param {DraggableRulerNode} rulerNode
   * @param {StopwatchNode} stopwatchNode
   * @param {Property.<boolean>} rulerVisibleProperty
   * @param {AlignGroup} alignGroup
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( stopwatch, dragBounds, rulerNode, stopwatchNode, rulerVisibleProperty, alignGroup, tandem, options ) {

    options = merge( {
      dragBounds: dragBounds,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 10,
      yMargin: 7,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    const toolbox = new HBox( {
      align: 'center',
      spacing: 30,
      tandem: tandem.createTandem( 'toolbox' ),
      excludeInvisibleChildrenFromBounds: false
    } );

    const toolboxAlignBox = new AlignBox( toolbox, { group: alignGroup } );

    super( toolboxAlignBox, options );

    // Create timer to be turned into icon
    const timer = new StopwatchNode( new Stopwatch( { isVisible: true, tandem: Tandem.OPT_OUT } ) );
    timer.scale( 0.5 );

    // Create ruler to be turned into icon
    const rulerWidth = 397; // 1 meter
    const rulerLength = 0.175 * rulerWidth;
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < 10; i++ ) { // create 10 empty strings for labels
      majorTickLabels.push( '' );
    }
    const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    const ruler = new RulerNode(
      rulerWidth,
      rulerLength,
      majorTickWidth,
      majorTickLabels,
      '',
      { tandem: tandem.createTandem( 'ruler' ) } );
    ruler.rotate( 40, false );
    ruler.scale( 0.12 );

    // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
    const rulerIcon = ruler.rasterized( {
      resolution: 5,
      imageOptions: {

        // Instead of changing the rendering, we'll dynamically generate a mipmap so the ruler icon appearance looks better.
        // See https://github.com/phetsims/masses-and-springs/issues/199.
        mipmap: true,
        cursor: 'pointer',
        tandem: tandem.createTandem( 'rulerIcon' )
      }
    } );

    // Drag listener for event forwarding: rulerIcon ---> rulerNode
    rulerIcon.addInputListener( DragListener.createForwardingListener( event => {
      rulerVisibleProperty.set( true );

      // Now determine the initial position where this element should move to after it's created, which corresponds
      // to the position of the mouse or touch event.
      const initialPosition = rulerNode.globalToParentPoint( event.pointer.point )
        .minus( new Vector2( -rulerNode.width * 0.5, rulerNode.height * 0.4 ) );
      rulerNode.positionProperty.set( initialPosition );

      // Sending through the startDrag from icon to rulerNode causes it to receive all subsequent drag events.
      rulerNode.rulerNodeDragListener.press( event );
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      dragBoundsProperty: new Property( dragBounds ),
      tandem: tandem.createTandem( 'dragListener' ),
      useParentOffset: true
    } ) );
    toolbox.addChild( rulerIcon );

    rulerVisibleProperty.link( visible => {
      rulerIcon.visible = !visible;
    } );

    // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
    const timerIcon = timer.rasterized( {
      resolution: 5,
      imageOptions: {
        cursor: 'pointer',
        tandem: tandem.createTandem( 'timerIcon' )
      }
    } );

    // Drag listener for event forwarding: timerIcon ---> stopwatchNode
    timerIcon.addInputListener( SimpleDragHandler.createForwardingListener( event => {

      // Toggle visibility
      stopwatch.isVisibleProperty.value = true;

      // Now determine the initial position where this element should move to after it's created, which corresponds
      // to the position of the mouse or touch event.
      const initialPosition = stopwatchNode.globalToParentPoint( event.pointer.point )
        .minus( new Vector2( stopwatchNode.width / 2, stopwatchNode.height * 0.4 ) );

      stopwatch.positionProperty.set( initialPosition );

      // Sending through the startDrag from icon to stopwatchNode causes it to receive all subsequent drag events.
      stopwatchNode.dragListener.press( event, stopwatchNode );
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      dragBounds: dragBounds,
      tandem: tandem.createTandem( 'dragListener' )
    } ) );
    toolbox.addChild( timerIcon );
    stopwatch.isVisibleProperty.link( visible => {
      timerIcon.visible = !visible;
    } );
  }
}

massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;