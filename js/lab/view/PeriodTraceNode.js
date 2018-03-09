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


    this.originalX = 400;
    this.middleX = this.originalX + X_OFFSET;
    this.lastX = this.originalX + 2 * X_OFFSET;

    this.path = new Path( null, { stroke: 'black', lineWidth: 3 } );
    this.addChild( this.path );
  }

  massesAndSprings.register( 'PeriodTraceNode', PeriodTraceNode );

  return inherit( Node, PeriodTraceNode, {
    step: function() {

      this.updateTrace( this.periodTrace.springProperty.value, this.modelViewTransform );
    },

    // TODO:documentation
    updateTrace: function( spring, modelViewTransform ) {

      var mass = spring.massAttachedProperty.value;
      if ( mass && !mass.userControlledProperty.value ) {
        this.visible = true;

        var lineOptions = { lineWidth: 3, stroke: 'black' };

        var centerOfMassPosition = new Vector2(
          mass.positionProperty.value.x,
          mass.positionProperty.value.y -
          mass.cylinderHeightProperty.value / 2 -
          mass.cylinderHeightProperty.value / 2 +
          mass.hookHeight
        );

        var equlibiumYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value );
        var firstPeakYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + this.periodTrace.firstPeakY );
        var secondPeakYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + this.periodTrace.secondPeakY );
        var currentYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + spring.massEquilibriumDisplacementProperty.value );


        spring.massEquilibriumDisplacementProperty.set( centerOfMassPosition.y - spring.massEquilibriumYPositionProperty.value );
        // debugger;

        var state = this.periodTrace.stateProperty.value; // 0 to 4

        // console.log(massPosition.y);
        if ( state === 0 ) {
          this.visible = false;
        }
        else {
          this.visible = true;
          var shape = new Shape();
          shape.moveTo( this.originalX, equlibiumYPosition ); // sets our current position
          shape.lineTo( this.originalX, state === 1 ? currentYPosition : firstPeakYPosition ); // draws a line from our current position to a NEW position, then sets our current position to the NEW position
          if ( state > 1 ) {

            // first connector
            shape.lineTo( this.middleX, firstPeakYPosition );

            // second line
            shape.lineTo( this.middleX, state === 2 ? currentYPosition : secondPeakYPosition );
            if ( state > 2 ) {

              // second connector
              shape.lineTo( this.lastX, secondPeakYPosition );

              // third line
              shape.lineTo( this.lastX, state === 3 ? currentYPosition : equlibiumYPosition );
            }
          }
          this.path.shape = shape;

        }
      }
      else {
        this.visible = false;
        this.periodTrace.stateProperty.reset();
        this.periodTrace.crossingProperty.reset();
      }
    }
  } );
} );