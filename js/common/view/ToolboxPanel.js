// Copyright 2017-2019, University of Colorado Boulder

/**
 * Responsible for the toolbox panel and the ruler/timer icons held within
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Panel = require( 'SUN/Panel' );
  const Range = require( 'DOT/Range' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Bounds2} dragBounds
   * @param {DraggableRulerNode} rulerNode
   * @param {DraggableTimerNode} timerNode
   * @param {Property.<boolean>} rulerVisibleProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {AlignGroup} alignGroup
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ToolboxPanel( dragBounds, rulerNode, timerNode, rulerVisibleProperty, timerVisibleProperty, alignGroup, tandem, options ) {
    options = _.extend( {
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
    const secondsProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondsProperty' ),
      units: 'seconds',
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );
    const isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );
    const timer = new TimerNode( secondsProperty, isRunningProperty );
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

    // Drag listener for event forwarding: timerIcon ---> timerNode
    timerIcon.addInputListener( new SimpleDragHandler.createForwardingListener( function( event ) {

      // Toggle visibility
      timerVisibleProperty.set( true );

      // Now determine the initial position where this element should move to after it's created, which corresponds
      // to the location of the mouse or touch event.
      const initialPosition = timerNode.globalToParentPoint( event.pointer.point )
        .minus( new Vector2( timerNode.width / 2, timerNode.height * 0.4 ) );

      timerNode.positionProperty.set( initialPosition );

      // Sending through the startDrag from icon to timerNode causes it to receive all subsequent drag events.
      timerNode.timerNodeMovableDragHandler.startDrag( event );
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      dragBounds: dragBounds,
      tandem: tandem.createTandem( 'dragHandler' )
    } ) );
    toolbox.addChild( timerIcon );
    timerVisibleProperty.link( function( visible ) {
      timerIcon.visible = !visible;
    } );
  }

  massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );
} );
