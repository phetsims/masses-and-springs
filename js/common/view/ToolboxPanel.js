// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 * Responsible for the toolbox panel and the ruler/timer icons held within
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Timer = require( 'SCENERY_PHET/Timer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Bounds2} dragBounds
   * @param {DraggableRulerNode} rulerNode
   * @param {DraggableTimerNode} timerNode
   * @param {Property.<boolean>} rulerVisibleProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {Options} options
   * @constructor
   */
  function ToolboxPanel( dragBounds, rulerNode, timerNode, rulerVisibleProperty, timerVisibleProperty, options ) {
    options = _.extend( {
      dragBounds: dragBounds,
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    var self = this;
    var toolbox = new HBox( {
      align: 'center',
      spacing: 30
    } );
    Panel.call( this, toolbox, options );

    // Create timer to be turned into icon
    var secondsProperty = new Property( 0 );
    var isRunningProperty = new Property( false );
    var timer = new Timer( secondsProperty, isRunningProperty );

    // Create ruler to be turned into icon
    var rulerWidth = 397; // 1 meter
    var rulerLength = .175 * rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) { // create 10 empty strings for labels
      majorTickLabels.push( '' );
    }
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    var ruler = new RulerNode( rulerWidth, rulerLength, majorTickWidth, majorTickLabels, '' );
    ruler.rotate( 40, false );

    // Create timer icon
    ruler.toImage( function( image ) {
      // @private - visible option is used only for reset() in ToolboxPanel.js
      self.rulerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: .1
      } );

      // Input listeners for the ruler icon
      var rulerParentScreenView = null; // needed for coordinate transforms
      var rulerUnboundedPosition = new Vector2();

      // Drag listener for event forwarding: rulerIcon ---> rulerNode 
      self.rulerIcon.addInputListener( new SimpleDragHandler( {
        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,

        start: function( event ) {
          // find the parent screen if not already found by moving up the scene graph
          if ( !rulerParentScreenView ) {
            var testNode = self;
            while ( testNode !== null ) {
              if ( testNode instanceof ScreenView ) {
                rulerParentScreenView = testNode;
                break;
              }
              testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
            }
            assert && assert( rulerParentScreenView, 'unable to find parent screen view' );
          }

          // Toggle visibility
          rulerVisibleProperty.set( true );
          rulerVisibleProperty.link( function( visible ) {
            self.rulerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = rulerParentScreenView.globalToLocalPoint( event.pointer.point )
            .minus( new Vector2( -rulerNode.width * .5, rulerNode.height * .4 ) );
          rulerNode.positionProperty.set( initialPosition );
          rulerUnboundedPosition.set( initialPosition );

        },
        translate: function( translationParams ) {
          rulerUnboundedPosition.setXY(
            rulerUnboundedPosition.x + translationParams.delta.x,
            rulerUnboundedPosition.y + translationParams.delta.y
          );
          rulerNode.positionProperty.set( new Vector2(
            Util.clamp( rulerUnboundedPosition.x, dragBounds.minX, dragBounds.maxX ),
            Util.clamp( rulerUnboundedPosition.y, dragBounds.minY, dragBounds.maxY )
          ) );
          rulerNode.positionProperty.set( rulerUnboundedPosition );
        },
        end: function( event ) {
          // When a node is released, check if it is over the toolbox.  If so, drop it in.
          if ( rulerNode.getGlobalBounds().intersectsBounds( self.getGlobalBounds() ) ) {
            rulerVisibleProperty.set( false );
            self.rulerIcon.visible = !rulerVisibleProperty.get();
          }
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
        scale: .4
      } );

      var timerParentScreenView2 = null; // needed for coordinate transforms
      var timerUnboundedPosition = new Vector2();

      // Drag listener for event forwarding: rulerIcon ---> rulerNode
      self.timerIcon.addInputListener( new SimpleDragHandler( {
        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,

        start: function( event ) {
          // find the parent screen if not already found by moving up the scene graph
          if ( !timerParentScreenView2 ) {
            var testNode = self;
            while ( testNode !== null ) {
              if ( testNode instanceof ScreenView ) {
                timerParentScreenView2 = testNode;
                break;
              }
              testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
            }
            assert && assert( timerParentScreenView2, 'unable to find parent screen view' );
          }

          // Toggle visibility
          timerVisibleProperty.set( true );
          timerVisibleProperty.link( function( visible ) {
            self.timerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = timerParentScreenView2.globalToLocalPoint( event.pointer.point )
            .minus( new Vector2( timerNode.width / 2, timerNode.height * .4 ) );

          timerNode.positionProperty.set( initialPosition );
          timerUnboundedPosition.set( initialPosition );
        },
        translate: function( translationParams ) {
          timerUnboundedPosition.setXY(
            timerUnboundedPosition.x + translationParams.delta.x,
            timerUnboundedPosition.y + translationParams.delta.y
          );
          timerNode.positionProperty.set( new Vector2(
            Util.clamp( timerUnboundedPosition.x, dragBounds.minX, dragBounds.maxX ),
            Util.clamp( timerUnboundedPosition.y, dragBounds.minY, dragBounds.maxY )
          ) );
          timerNode.positionProperty.set( timerUnboundedPosition );
        },
        end: function( event ) {
          // When a node is released, check if it is over the toolbox.  If so, drop it in.
          if ( timerNode.getGlobalBounds().intersectsBounds( self.getGlobalBounds() ) ) {
            timerVisibleProperty.set( false );
            self.timerIcon.visible = !timerVisibleProperty.get();
          }
        }
      } ) );
      toolbox.addChild( self.timerIcon );
    } );
  }

  massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );

} );
