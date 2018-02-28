// Copyright 2018, University of Colorado Boulder

/**
 * View for period trace of mass oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @constructor
   */
  function PeriodTraceNode( periodTrace, modelViewTransform, options ) {
    Node.call( this );
    var self = this;

    // @protected
    this.periodTrace = periodTrace;

    // @protected
    this.modelViewTransform = modelViewTransform;

    this.lineOne = new Line( 0, 0, 0, 0, { lineWidth: 0 } );


  }

  massesAndSprings.register( 'PeriodTraceNode', PeriodTraceNode );

  return inherit( Node, PeriodTraceNode, {
    step: function() {
      if ( this.periodTrace.massProperty.value ) {
        this.updateTrace( this.periodTrace.massProperty.value, this.modelViewTransform );
      }
    },

    // TODO:documentation
    updateTrace: function( mass, modelViewTransform ) {
      if ( !mass.userControlledProperty.value ) {

        var lineOptions = { lineWidth: 3, stroke: 'black' };

        var massPosition = modelViewTransform.modelToViewPosition( mass.positionProperty.value );
        var massEquilibriumYPosition = modelViewTransform.modelToViewY(
          mass.springProperty.value.massEquilibriumYPositionProperty.value
        );


//
//
//
//
// var originY = 0;
//
// function TraceNode( trace ) {
// this.trace = trace;
//
//    this.path = new Path( null, { ... } );
//    this.addChild( path );
// }
//
// inherit( laknsrtlkanrst, {
//  step: function( dt ) {
//
//    var firstY = trace.firstY; // when velocity first changes direction AFTER our first zero-crossing
//    var secondY = trace.secondY; // when velocity changes direction after our SECOND zero-crossing
//
//    var state = trace.state; // 0 to 4
//
//    if ( state === 0 ) {
//      this.visible = false;
//    }
//    else {
//      this.visible = true;
//      var shape = new Shape();
//
//      // first line
//      shape.moveTo( originalX, originY );            // sets our current position
//      shape.lineTo( originalX, state === 1 ? currentY : firstY ); // draws a line from our current position to a NEW position, then sets our current position to the NEW position
//      if ( state > 1 ) {
//        // first connector
//        shape.lineTo( middleX, firstY );
//        // second line
//        shape.lineTo( middleX, state === 2 ? currentY : secondY );
//        if ( state > 2 ) {
//          // second connector
//          shape.lineTo( lastX, secondY );
//          // third line
//          shape.lineTo( lastX, state === 3 ? currentY : originY );
//        }
//      }
//    }
//
//    this.path.shape = shape;
//  }
// } );

// updateShape()


        //
        // this.lineOne = new Line(
        //   massPosition.x + this.periodTrace.xOffsetProperty.value,
        //   massEquilibriumYPosition,
        //   massPosition.x + this.periodTrace.xOffsetProperty.value,
        //   massPosition.y,
        //   lineOptions
        // );
        // this.addChild( this.lineOne );
      }
      else {

        // Once the user drags a mass the lines should be be removed.
        this.removeAllChildren();
      }
    }
  } );
} );