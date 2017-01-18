// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityControlPanel = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/GravityControlPanel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/DraggableRulerNode' );
  var MassNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/OscillatingSpringNode' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReferenceLine = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/ReferenceLine' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/SpringConstantControlPanel' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var referenceLineString = require( 'string!MASSES_AND_SPRINGS/referenceLine' );
  var rulerString = require( 'string!MASSES_AND_SPRINGS/ruler' );
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var stopwatchString = require( 'string!MASSES_AND_SPRINGS/stopwatch' );

  var FONT = new PhetFont( 12 );

  // constants
  var TOUCH_AREA_DILATION = 4;
  var STROKE = 'black';
  var FILL = '#005566';

  /**
   * TODO::: Remove mvt transforms from view objects
   * TODO::: Factor out colors to a Constants object
   * TODO::: Factor out thumb size, track size, etc other slider properties
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function MassesAndSpringsScreenView( model ) {
    this.model = model; // Make model available for reset
    var self = this;
    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504
      )
    } );

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .98 ),
      397 );
    this.mvt = mvt; // Make mvt available to descendant types.

    this.viewProperties = new PropertySet( {
      rulerVisible: true,
      stopwatchVisible: false,
      referenceLineVisible: true,
      equilibriumPositionVisible: false
    } );

    //  Node for ComboBox menus.  Add this last.
    var listParentNode = new Node();

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        self.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );
    this.addChild( resetAllButton );

    // Play Pause Button
    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      centerX: this.layoutBounds.width * 0.75,
      centerY: resetAllButton.centerY,
      radius: 18,
      touchAreaDilation: TOUCH_AREA_DILATION
    } );
    this.addChild( playPauseButton );

    // Step Forward Button
    var stepForwardButton = new StepForwardButton( {
      playingProperty: model.playingProperty,
      listener: function() { model.stepForward(); },
      radius: 12,
      stroke: STROKE,
      fill: FILL,
      touchAreaDilation: TOUCH_AREA_DILATION,
      y: playPauseButton.centerY,
      left: playPauseButton.right + 10
    } );
    this.addChild( stepForwardButton );

    // Gravity Control Panel
    var gravityControlPanel = new GravityControlPanel( model.gravityProperty, model.gravityRange, model.bodies, listParentNode, {
      right: this.layoutBounds.width - 10,
      top: 280,
      minWidth: 1
    } );
    this.addChild( gravityControlPanel );


    // Control Panel for display elements with varying visibility
    // TODO: Decouple the checkBoxGroup
    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new Text( rulerString, FONT ),
        property: this.viewProperties.rulerVisibleProperty,
        label: rulerString
      },
      {
        content: new Text( referenceLineString, FONT ),
        property: this.viewProperties.referenceLineVisibleProperty,
        label: referenceLineString
      },
      {
        content: new Text( stopwatchString, FONT ),
        property: this.viewProperties.stopwatchVisibleProperty,
        label: stopwatchString
      },
      {
        content: new Text( equilibriumPositionString, FONT ),
        property: this.viewProperties.equilibriumPositionVisibleProperty,
        label: equilibriumPositionString
      }
    ], { boxWidth: 15, spacing: 5 } );
    var titleToControlsVerticalSpace = 7;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        new HBox( { children: [ new HStrut( 10 ), indicatorVisibilityCheckBoxGroup ] } )
      ],
      align: 'left'
    } );
    var indicatorVisibilityControlPanel = new Panel( indicatorVisibilityControlsVBox,
      {
        xMargin: 31,
        fill: 'rgb( 240, 240, 240 )',
        top: mvt.modelToViewY( model.ceilingY ),
        right: this.layoutBounds.width - 10
      } );
    this.addChild( indicatorVisibilityControlPanel );


    // TODO: move color and isLabeled to model
    // TODO: add massLayer
    this.massLayer = new Node();
    this.massLayer.addChild( new MassNode( model.masses[ 0 ], mvt, 'grey', true, self, model ) );
    this.massLayer.addChild( new MassNode( model.masses[ 1 ], mvt, 'grey', true, self, model ) );
    this.massLayer.addChild( new MassNode( model.masses[ 2 ], mvt, 'grey', true, self, model ) );
    this.massLayer.addChild( new MassNode( model.masses[ 3 ], mvt, 'red', false, self, model ) );
    this.massLayer.addChild( new MassNode( model.masses[ 4 ], mvt, 'blue', false, self, model ) );
    this.massLayer.addChild( new MassNode( model.masses[ 5 ], mvt, 'green', false, self, model ) );


    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    this.addChild( new OscillatingSpringNode( model.springs[ 0 ], mvt ) );
    this.addChild( new OscillatingSpringNode( model.springs[ 1 ], mvt ) );

    this.addChild( new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.format( springConstantString, 1 ), {
        right: this.layoutBounds.width - 10,
        top: mvt.modelToViewY( .75 )
      } ) );
    this.addChild( new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.format( springConstantString, 2 ), {
        right: this.layoutBounds.width - 10,
        top: mvt.modelToViewY( .95 )
      } ) );

    // This should always be after all nodes containing a ComboBox
    this.addChild( listParentNode );

    this.addChild( new DraggableRulerNode( this.layoutBounds, new Vector2( this.layoutBounds.left + 50, mvt.modelToViewY( model.ceilingY ) ), this.viewProperties.rulerVisibleProperty ) );

    this.referenceLine = new ReferenceLine( this.layoutBounds.getCenter().minus( new Vector2( 110, 0 ) ), this.layoutBounds, 400, this.viewProperties.referenceLineVisibleProperty );
    this.addChild( this.referenceLine );

    this.addChild( this.massLayer );

  }

  massesAndSprings.register( 'MassesAndSpringsScreenView', MassesAndSpringsScreenView );

  return inherit( ScreenView, MassesAndSpringsScreenView, {
    reset: function() {
      //TODO:: reset Ruler and ReferenceLine
      // make sure view is also reset
      this.model.reset();
      this.viewProperties.reset();

      //TODO highly recommended not to reset view this way
      this.children.forEach( function( child ) {
        if ( child && child.reset ) {
          child.reset();
        }
      } );
    }
  } );
} );