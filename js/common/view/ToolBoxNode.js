// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Timer = require( 'SCENERY_PHET/Timer' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   *
   * @param {Object} options
   * @constructor
   */
  function ToolBoxNode( options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      align: 'center'
    }, options );

    var toolbox = new HBox( {
      align: 'center',
      spacing: 20,
      children: [
        new Text( 'Ruler', { font: MassesAndSpringsConstants.TITLE_FONT } )
      ]
    } );
    Panel.call( this, toolbox, options );

    var isTimerVisible = new Property( false );

    // Create timer
    var secondsProperty = new Property( 0 );
    var isRunningProperty = new Property( false );
    var timer = new Timer( secondsProperty, isRunningProperty );

    // Create timer icon
    timer.toImage( function( image ) {
      var timerIcon = new Image( image, { cursor: 'pointer', pickable: true, scale: .4 } );

      // Input listeners for timer icon
      timerIcon.addInputListener( {
        down: function() {
          timerIcon.opacity = 0;
          isTimerVisible.set( true );
          console.log( 'isTimerVisible = ' + isTimerVisible.get() );
        },
        up: function() {
          timerIcon.opacity = 1;
          isTimerVisible.set( false );
          console.log( 'isTimerVisible = ' + isTimerVisible.get() );
        }
      } );
      toolbox.addChild( timerIcon );
    } );
  }

  massesAndSprings.register( 'ToolBoxNode', ToolBoxNode );

  return inherit( Panel, ToolBoxNode );

} );
