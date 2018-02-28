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
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var X_OFFSET = 20;

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

    this.originalY = this.periodTrace.originalY;
    this.originalX = 400;
    this.middleX = this.originalX + X_OFFSET;
    this.lastX = this.originalX + 2 * X_OFFSET;

    this.path = new Path( null, { stroke: 'black', lineWidth: 3 } );
    this.addChild( this.path );
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

        // debugger;
        var firstY = this.periodTrace.firstPeekY; // when velocity first changes direction AFTER our first zero-crossing
        var secondY = this.periodTrace.secondPeekY; // when velocity changes direction after our SECOND zero-crossing

        var state = this.periodTrace.stateProperty.value; // 0 to 4
        // console.log(state);
        // console.log(massPosition.y);
        // debugger;
        if ( state === 0 ) {
          // debugger;
          this.visible = false;
        }
        else {
          this.visible = true;
          var shape = new Shape();

          // first line
          console.log( massPosition.y )

          shape.moveTo( this.originalX, this.originalY );            // sets our current position
          shape.lineTo( this.originalX, massPosition.y ); // draws a line from our current position to a NEW position, then sets our current position to the NEW position
          if ( state > 1 ) {
            // first connector
            shape.lineTo( this.middleX, firstY );
            // second line
            shape.lineTo( this.middleX, massPosition.y );
            if ( state > 2 ) {
              // second connector
              shape.lineTo( this.lastX, state === 2 ? massPosition.y : secondY );
              // third line
              shape.lineTo( this.lastX, massPosition.y );
            }
          }
          this.path.shape = shape;

        }
      }
    }
  } );
} );