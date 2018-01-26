// Copyright 2017, University of Colorado Boulder

/**
 * Responsible for the toolbox panel and the ruler/timer icons held within
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Panel = require( 'SUN/Panel' );
  var Range = require( 'DOT/Range' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Bounds2} dragBounds
   * @param {DraggableRulerNode} rulerNode
   * @param {DraggableTimerNode} timerNode
   * @param {Property.<boolean>} rulerVisibleProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ToolboxPanel( dragBounds, rulerNode, timerNode, rulerVisibleProperty, timerVisibleProperty, tandem, options ) {
    options = _.extend( {
      dragBounds: dragBounds,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 5,
      yMargin: 5,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    this.dragBounds = options.dragBounds;

    var self = this;
    var toolbox = new HBox( {
      align: 'center',
      spacing: 30,
      tandem: tandem.createTandem( 'toolbox' )
    } );
    Panel.call( this, toolbox, options );

    // Create timer to be turned into icon
    var secondsProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondsProperty' ),
      units: 'seconds',
      range: new Range( 0, Number.POSITIVE_INFINITY )
    } );
    var isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );
    var timer = new TimerNode( secondsProperty, isRunningProperty );

    // Create ruler to be turned into icon
    var rulerWidth = 397; // 1 meter
    var rulerLength = 0.175 * rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) { // create 10 empty strings for labels
      majorTickLabels.push( '' );
    }
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    var ruler = new RulerNode(
      rulerWidth,
      rulerLength,
      majorTickWidth,
      majorTickLabels,
      '',
      { tandem: tandem.createTandem( 'ruler' ) } );
    ruler.rotate( 40, false );

    // Create timer icon
    ruler.toImage( function( image ) {

      // @private - visible option is used only for reset() in ToolboxPanel.js
      self.rulerIcon = new Image( image, {
        cursor: 'pointer',
        renderer: 'webgl',
        pickable: true,
        scale: 0.1,
        tandem: tandem.createTandem( 'rulerIcon' )
      } );

      // Input listeners for the ruler icon
      var rulerUnboundedPosition = new Vector2();

      // Drag listener for event forwarding: rulerIcon ---> rulerNode
      self.rulerIcon.addInputListener( new MovableDragHandler( rulerNode.positionProperty, {

        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,
        dragBounds: dragBounds,
        tandem: tandem.createTandem( 'dragHandler' ),

        startDrag: function( event ) {
          // Toggle visibility
          rulerVisibleProperty.set( true );
          rulerVisibleProperty.link( function( visible ) {
            self.rulerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = rulerNode.globalToParentPoint( event.pointer.point )
            .minus( new Vector2( -rulerNode.width * 0.5, rulerNode.height * 0.4 ) );
          rulerNode.positionProperty.set( initialPosition );
          rulerUnboundedPosition.set( initialPosition );

          // Sending through the startDrag from icon to rulerNode causes it to receive all subsequent drag events.
          rulerNode.rulerNodeMovableDragHandler.startDrag( event );
        }
      } ) );
      toolbox.addChild( self.rulerIcon );
    } );

    // Create timer icon
    timer.toImage( function( image ) {

      // @private - visible option is used only for reset() in ToolboxPanel.js
      self.timerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: 0.4,
        tandem: tandem.createTandem( 'timerIcon' )
      } );

      // Drag listener for event forwarding: timerIcon ---> timerNode
      self.timerIcon.addInputListener( new MovableDragHandler( timerNode.positionProperty, {

        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,
        dragBounds: dragBounds,
        tandem: tandem.createTandem( 'dragHandler' ),

        startDrag: function( event ) {
          // Toggle visibility
          timerVisibleProperty.set( true );
          timerVisibleProperty.link( function( visible ) {
            self.timerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = timerNode.globalToParentPoint( event.pointer.point )
            .minus( new Vector2( timerNode.width / 2, timerNode.height * 0.4 ) );

          timerNode.positionProperty.set( initialPosition );

          // Sending through the startDrag from icon to timerNode causes it to receive all subsequent drag events.
          timerNode.timerNodeMovableDragHandler.startDrag( event );
        }
      } ) );
      toolbox.addChild( self.timerIcon );
    } );
  }

  massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );

} );
