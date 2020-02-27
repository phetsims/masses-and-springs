// Copyright 2017-2020, University of Colorado Boulder

/**
 * Responsible for the toolbox panel and the ruler/timer icons held within
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

/**
 * @param {Stopwatch} stopwatch
 * @param {Bounds2} dragBounds
 * @param {DraggableRulerNode} rulerNode
 * @param {StopwatchNode} stopwatchNode
 * @param {Property.<boolean>} rulerVisibleProperty
 * @param {AlignGroup} alignGroup
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function ToolboxPanel( stopwatch, dragBounds, rulerNode, stopwatchNode, rulerVisibleProperty, alignGroup, tandem, options ) {
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
    xMargin: 500,
    spacing: 30,
    tandem: tandem.createTandem( 'toolbox' )
  } );

  const toolboxAlignBox = new AlignBox( toolbox, { group: alignGroup } );
  Panel.call( this, toolboxAlignBox, options );


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
    // Instead of changing the rendering, we'll dynamically generate a mipmap so the ruler icon appearance looks better.
    // See https://github.com/phetsims/masses-and-springs/issues/199.
    mipmap: true,
    cursor: 'pointer',
    resolution: 5,
    tandem: tandem.createTandem( 'rulerIcon' )
  } );

  // Drag listener for event forwarding: rulerIcon ---> rulerNode
  rulerIcon.addInputListener( new SimpleDragHandler.createForwardingListener( function( event ) {
    rulerVisibleProperty.set( true );

    // Now determine the initial position where this element should move to after it's created, which corresponds
    // to the location of the mouse or touch event.
    const initialPosition = rulerNode.globalToParentPoint( event.pointer.point )
      .minus( new Vector2( -rulerNode.width * 0.5, rulerNode.height * 0.4 ) );
    rulerNode.positionProperty.set( initialPosition );

    // Sending through the startDrag from icon to rulerNode causes it to receive all subsequent drag events.
    rulerNode.rulerNodeMovableDragHandler.startDrag( event );
  }, {

    // allow moving a finger (on a touchscreen) dragged across this node to interact with it
    allowTouchSnag: true,
    dragBounds: dragBounds,
    tandem: tandem.createTandem( 'dragHandler' )
  } ) );
  toolbox.addChild( rulerIcon );

  rulerVisibleProperty.link( function( visible ) {
    rulerIcon.visible = !visible;
  } );

  // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
  const timerIcon = timer.rasterized( {
    cursor: 'pointer',
    resolution: 5,
    tandem: tandem.createTandem( 'timerIcon' )
  } );

  // Drag listener for event forwarding: timerIcon ---> stopwatchNode
  timerIcon.addInputListener( new SimpleDragHandler.createForwardingListener( function( event ) {

    // Toggle visibility
    stopwatch.isVisibleProperty.value = true;

    // Now determine the initial position where this element should move to after it's created, which corresponds
    // to the location of the mouse or touch event.
    const initialPosition = stopwatchNode.globalToParentPoint( event.pointer.point )
      .minus( new Vector2( stopwatchNode.width / 2, stopwatchNode.height * 0.4 ) );

    stopwatch.positionProperty.set( initialPosition );

    // Sending through the startDrag from icon to stopwatchNode causes it to receive all subsequent drag events.
    stopwatchNode.dragListener.press( event, stopwatchNode );
  }, {

    // allow moving a finger (on a touchscreen) dragged across this node to interact with it
    allowTouchSnag: true,
    dragBounds: dragBounds,
    tandem: tandem.createTandem( 'dragHandler' )
  } ) );
  toolbox.addChild( timerIcon );
  stopwatch.isVisibleProperty.link( function( visible ) {
    timerIcon.visible = !visible;
  } );
}

massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

inherit( Panel, ToolboxPanel );
export default ToolboxPanel;